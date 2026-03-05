// src/data/repositories/subscription/SubscriptionRepositoryImpl.ts
import axiosInstance from '../../apis/axiosInstance';
import {
    ServicePlan,
    ActiveSubscription,
    SepayPurchaseResult,
    TransactionHistory,
    TransactionStatus,
    HealthReport,
    DashboardPro,
} from '../../../domain/entities/Subscription';

interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

export class SubscriptionRepositoryImpl {

    /** GET /api/public/service-plans — lấy danh sách gói dịch vụ */
    async getAllPlans(): Promise<ServicePlan[]> {
        const response = await axiosInstance.get('/api/public/service-plans');
        // API returns paginated: { data: { content: [...], pageable: {...} } }
        const rawData = response.data?.data;
        const content = rawData?.content ?? rawData;
        const items = Array.isArray(content) ? content : [];
        // Transform: features comes as comma-separated string, convert to array
        return items.map((item: any) => ({
            ...item,
            features: typeof item.features === 'string'
                ? item.features.split(',').map((f: string) => f.trim())
                : (item.features || []),
        }));
    }

    /** GET /api/public/service-plans/{id} — chi tiết 1 gói */
    async getPlanById(id: number): Promise<ServicePlan> {
        const response = await axiosInstance.get<ApiResponse<ServicePlan>>(
            `/api/public/service-plans/${id}`,
        );
        return response.data.data;
    }

    /** GET /api/subscriptions/me — subscription hiện tại của user */
    async getMySubscription(): Promise<ActiveSubscription | null> {
        try {
            const response = await axiosInstance.get<ApiResponse<ActiveSubscription>>(
                '/api/subscriptions/me',
            );
            return response.data.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null; // Chưa có subscription
            }
            throw error;
        }
    }

    /** POST /api/subscriptions/purchase-sepay — mua gói qua SePay */
    async purchaseSepay(planId: number): Promise<SepayPurchaseResult> {
        const response = await axiosInstance.post<ApiResponse<SepayPurchaseResult>>(
            '/api/subscriptions/purchase-sepay',
            { servicePlanId: planId },
        );
        return response.data.data;
    }

    /** GET /api/subscriptions/transactions — lịch sử giao dịch */
    async getTransactions(): Promise<TransactionHistory[]> {
        const response = await axiosInstance.get<ApiResponse<TransactionHistory[]>>(
            '/api/subscriptions/transactions',
        );
        return response.data.data;
    }

    /** GET /api/subscriptions/transactions/{id}/status — trạng thái giao dịch (polling) */
    async getTransactionStatus(transactionId: number): Promise<TransactionStatus> {
        const response = await axiosInstance.get<ApiResponse<TransactionStatus>>(
            `/api/subscriptions/transactions/${transactionId}/status`,
        );
        return response.data.data;
    }

    /** POST /api/subscriptions/cancel — hủy gói */
    async cancelSubscription(): Promise<void> {
        await axiosInstance.post('/api/subscriptions/cancel');
    }

    // ===== Premium Features =====

    /** GET /api/subscriptions/report/weekly — báo cáo tuần */
    async getWeeklyReport(): Promise<HealthReport> {
        const response = await axiosInstance.get<ApiResponse<HealthReport>>(
            '/api/subscriptions/report/weekly',
        );
        return response.data.data;
    }

    /** GET /api/subscriptions/report/full — báo cáo đầy đủ */
    async getFullReport(from?: string, to?: string): Promise<HealthReport> {
        const params: any = {};
        if (from) params.from = from;
        if (to) params.to = to;
        const response = await axiosInstance.get<ApiResponse<HealthReport>>(
            '/api/subscriptions/report/full',
            { params },
        );
        return response.data.data;
    }

    /** GET /api/subscriptions/dashboard-pro — dashboard nâng cao */
    async getDashboardPro(): Promise<DashboardPro> {
        const response = await axiosInstance.get<ApiResponse<DashboardPro>>(
            '/api/subscriptions/dashboard-pro',
        );
        return response.data.data;
    }

    /** GET /api/subscriptions/report/export-pdf — xuất PDF */
    async exportPdf(from?: string, to?: string): Promise<ArrayBuffer> {
        const params: any = {};
        if (from) params.from = from;
        if (to) params.to = to;
        const response = await axiosInstance.get(
            '/api/subscriptions/report/export-pdf',
            { params, responseType: 'arraybuffer' },
        );
        return response.data;
    }

    /** GET /api/subscriptions/check-feature?feature={code} — kiểm tra tính năng */
    async checkFeature(featureCode: string): Promise<boolean> {
        try {
            const response = await axiosInstance.get<ApiResponse<{ allowed: boolean }>>(
                '/api/subscriptions/check-feature',
                { params: { feature: featureCode } },
            );
            return response.data.data.allowed;
        } catch {
            return false;
        }
    }

    /** GET /api/subscriptions/feature-quota?feature={code} — quota tính năng */
    async getFeatureQuota(featureCode: string): Promise<{ used: number; limit: number; remaining: number; allowed: boolean }> {
        const response = await axiosInstance.get<ApiResponse<{ used: number; limit: number; remaining: number; allowed: boolean }>>(
            '/api/subscriptions/feature-quota',
            { params: { feature: featureCode } },
        );
        return response.data.data;
    }
}
