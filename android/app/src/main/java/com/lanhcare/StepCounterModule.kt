package com.lanhcare

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlin.math.max

class StepCounterModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val PREFS_NAME = "step_counter_prefs"
        private const val KEY_TRACKING_DATE = "tracking_date"
        private const val KEY_ACCUMULATED_STEPS = "accumulated_steps"
        private const val KEY_LAST_RAW_VALUE = "last_raw_value"
        private const val SENSOR_TIMEOUT_MS = 10000L
    }

    override fun getName(): String = "StepCounterModule"

    @ReactMethod
    fun isSensorAvailable(promise: Promise) {
        promise.resolve(getStepCounterSensor() != null)
    }

    @ReactMethod
    fun initialize(promise: Promise) {
        if (getStepCounterSensor() == null) {
            promise.resolve(false)
            return
        }

        awaitCurrentSensorValue(
            onSuccess = { rawValue ->
                initializeTrackingState(rawValue.toInt())
                promise.resolve(true)
            },
            onError = { code, message ->
                if (code == "SENSOR_TIMEOUT") {
                    val lastRawValue = getLastRawValueOrNull()
                    if (lastRawValue != null) {
                        initializeTrackingState(lastRawValue)
                        promise.resolve(true)
                        return@awaitCurrentSensorValue
                    }
                }

                promise.reject(code, message)
            },
        )
    }

    @ReactMethod
    fun getTodaySteps(promise: Promise) {
        if (getStepCounterSensor() == null) {
            promise.reject("SENSOR_NOT_AVAILABLE", "Step counter sensor is not available on this device")
            return
        }

        awaitCurrentSensorValue(
            onSuccess = { rawValue ->
                promise.resolve(computeTodaySteps(rawValue.toInt()))
            },
            onError = { code, message ->
                if (code == "SENSOR_TIMEOUT") {
                    val storedSteps = getStoredTodaySteps()
                    if (storedSteps != null) {
                        promise.resolve(storedSteps)
                        return@awaitCurrentSensorValue
                    }
                }

                promise.reject(code, message)
            },
        )
    }

    private fun getSensorManager(): SensorManager? {
        return reactContext.getSystemService(Context.SENSOR_SERVICE) as? SensorManager
    }

    private fun getStepCounterSensor(): Sensor? {
        return getSensorManager()?.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)
    }

    private fun awaitCurrentSensorValue(
        onSuccess: (Float) -> Unit,
        onError: (String, String) -> Unit,
    ) {
        val sensorManager = getSensorManager()
        val sensor = getStepCounterSensor()

        if (sensorManager == null || sensor == null) {
            onError("SENSOR_NOT_AVAILABLE", "Step counter sensor is not available on this device")
            return
        }

        val handler = Handler(Looper.getMainLooper())
        var completed = false

        val listener = object : SensorEventListener {
            override fun onSensorChanged(event: SensorEvent) {
                if (completed || event.values.isEmpty()) {
                    return
                }

                completed = true
                sensorManager.unregisterListener(this)
                handler.removeCallbacksAndMessages(null)
                onSuccess(event.values[0])
            }

            override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) = Unit
        }

        val timeoutRunnable = Runnable {
            if (completed) {
                return@Runnable
            }

            completed = true
            sensorManager.unregisterListener(listener)
            onError("SENSOR_TIMEOUT", "Timed out waiting for step counter sensor")
        }

        sensorManager.registerListener(listener, sensor, SensorManager.SENSOR_DELAY_NORMAL)
        handler.postDelayed(timeoutRunnable, SENSOR_TIMEOUT_MS)
    }

    private fun initializeTrackingState(rawSteps: Int) {
        val prefs = reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val today = todayKey()
        val storedDate = prefs.getString(KEY_TRACKING_DATE, null)
        val storedRawValue = prefs.getInt(KEY_LAST_RAW_VALUE, -1)

        if (storedDate != today || storedRawValue < 0 || rawSteps < storedRawValue) {
            prefs.edit()
                .putString(KEY_TRACKING_DATE, today)
                .putInt(KEY_ACCUMULATED_STEPS, 0)
                .putInt(KEY_LAST_RAW_VALUE, rawSteps)
                .apply()
        }
    }

    private fun computeTodaySteps(rawSteps: Int): Int {
        val prefs = reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val today = todayKey()
        val storedDate = prefs.getString(KEY_TRACKING_DATE, null)
        val storedRawValue = prefs.getInt(KEY_LAST_RAW_VALUE, -1)
        val accumulatedSteps = prefs.getInt(KEY_ACCUMULATED_STEPS, 0)

        if (storedDate != today || storedRawValue < 0 || rawSteps < storedRawValue) {
            prefs.edit()
                .putString(KEY_TRACKING_DATE, today)
                .putInt(KEY_ACCUMULATED_STEPS, 0)
                .putInt(KEY_LAST_RAW_VALUE, rawSteps)
                .apply()
            return 0
        }

        val delta = max(0, rawSteps - storedRawValue)
        val totalSteps = accumulatedSteps + delta

        prefs.edit()
            .putString(KEY_TRACKING_DATE, today)
            .putInt(KEY_ACCUMULATED_STEPS, totalSteps)
            .putInt(KEY_LAST_RAW_VALUE, rawSteps)
            .apply()

        return totalSteps
    }

    private fun todayKey(): String {
        return SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
    }

    private fun getLastRawValueOrNull(): Int? {
        val prefs = reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val lastRawValue = prefs.getInt(KEY_LAST_RAW_VALUE, -1)
        return if (lastRawValue >= 0) lastRawValue else null
    }

    private fun getStoredTodaySteps(): Int? {
        val prefs = reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val storedDate = prefs.getString(KEY_TRACKING_DATE, null)
        if (storedDate != todayKey()) {
            return null
        }

        return prefs.getInt(KEY_ACCUMULATED_STEPS, 0)
    }
}