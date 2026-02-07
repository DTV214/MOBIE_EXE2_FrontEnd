// src/di/Container.ts

// --- 1. DATA LAYER (REPOSITORIES) ---
// Real Implementations (API thật)
import { AuthRepositoryImpl } from '../data/repositories/auth/AuthRepositoryImpl';
import { DailyLogRepositoryImpl } from '../data/repositories/daily-log/DailyLogRepositoryImpl';
import { MealLogRepositoryImpl } from '../data/repositories/daily-log/meal-log/MealLogRepositoryImpl';
import { FoodRepositoryImpl } from '../data/repositories/food/FoodRepositoryImpl';
import { MealFoodRepositoryImpl } from '../data/repositories/meal-food/MealFoodRepositoryImpl';
import { ExerciseRepositoryImpl } from '../data/repositories/exercise/ExerciseRepositoryImpl';
import { ForumRepositoryImpl } from '../data/repositories/forum/ForumRepositoryImpl';

// Mocks (Dùng cho các module chưa có API thật)
import { MockUserRepository } from '../data/repositories/MockUserRepository';
import { StorageRepository } from '../data/repositories/StorageRepository';
import { MockHealthRepository } from '../data/repositories/MockHealthRepository';
import { MockChatRepository } from '../data/repositories/MockChatRepository';
import { MockHospitalRepository } from '../data/repositories/MockHospitalRepository';
import { MockSubscriptionRepository } from '../data/repositories/MockSubscriptionRepository';

// --- 2. DOMAIN LAYER (USE CASES) ---
// Auth
import { LoginWithGoogle } from '../domain/usecases/auth/LoginWithGoogle';

// Onboarding & Profile
import { GetUserProfile } from '../domain/usecases/GetUserProfile';
import { CheckOnboardingStatus } from '../domain/usecases/CheckOnboardingStatus';
import { CompleteOnboarding } from '../domain/usecases/CompleteOnboarding';

// Tracking & Diary (LÀNH CARE CORE)
import { GetDailyLogByDateUseCase } from '../domain/usecases/daily-log/GetDailyLogByDate';
import { CreateDailyLogUseCase } from '../domain/usecases/daily-log/CreateDailyLog';
import { GetMealLogsByDailyLogIdUseCase } from '../domain/usecases/daily-log/GetMealLogsByDailyLogId';
import { CreateMealLogUseCase } from '../domain/usecases/daily-log/meal-log/CreateMealLog';
import { UpdateMealLogUseCase } from '../domain/usecases/daily-log/meal-log/UpdateMealLog';
import { DeleteMealLogUseCase } from '../domain/usecases/daily-log/meal-log/DeleteMealLog';

// Food & Meal Items
import { GetFoodItemsUseCase } from '../domain/usecases/food/GetFoodItems';
import { GetMealFoodsByMealIdUseCase } from '../domain/usecases/meal-food/GetMealFoodsByMealId';
import { AddFoodToMealUseCase } from '../domain/usecases/meal-food/AddFoodToMeal';
import { UpdateMealFoodQuantityUseCase } from '../domain/usecases/meal-food/UpdateMealFoodQuantity';
import { RemoveFoodFromMealUseCase } from '../domain/usecases/meal-food/RemoveFoodFromMeal';

// Exercise Tracking
import { GetExerciseTypesUseCase } from '../domain/usecases/exercise/GetExerciseTypesUseCase';
import { GetExercisesByDailyLogIdUseCase } from '../domain/usecases/exercise/GetExercisesByDailyLogIdUseCase';
import { AddExerciseLogUseCase } from '../domain/usecases/exercise/AddExerciseLogUseCase';
import { UpdateExerciseLogUseCase } from '../domain/usecases/exercise/UpdateExerciseLogUseCase';
import { RemoveExerciseLogUseCase } from '../domain/usecases/exercise/RemoveExerciseLogUseCase';

// Forum Module (Sử dụng Repository thật để gọi API)
import { GetAllPosts } from '../domain/usecases/forum/GetAllPosts';
import { CreatePost } from '../domain/usecases/forum/CreatePost';
import { UploadMedia } from '../domain/usecases/forum/UploadMedia';
import { GetPostById } from '../domain/usecases/forum/GetPostById';
import { UpdatePost } from '../domain/usecases/forum/UpdatePost';
import { DeletePost } from '../domain/usecases/forum/DeletePost';
import { GetMyPosts } from '../domain/usecases/forum/GetMyPosts';

// Health Insights, AI Chat, Hospital & Subscription (Tạm dùng Mocks)
import { GetDailyProgress } from '../domain/usecases/GetDailyProgress';
import { GetHealthInsights } from '../domain/usecases/GetHealthInsights';
import { GetHealthTips } from '../domain/usecases/GetHealthTips';
import { GetHeartRateTrend } from '../domain/usecases/GetHeartRateTrend';
import { GetHealthSummary } from '../domain/usecases/GetHealthSummary';
import { SendChatMessage } from '../domain/usecases/SendChatMessage';
import { GetChatSession } from '../domain/usecases/GetChatSession';
import { GetSuggestedQuestions } from '../domain/usecases/GetSuggestedQuestions';
import { SearchFacilities } from '../domain/usecases/SearchFacilities';
import { SuggestFacilitiesBySymptoms } from '../domain/usecases/SuggestFacilitiesBySymptoms';
import { GetFacilityById } from '../domain/usecases/GetFacilityById';
import { GetAllPlans } from '../domain/usecases/GetAllPlans';
import { GetPlanById } from '../domain/usecases/GetPlanById';
import { GetPaymentMethods } from '../domain/usecases/GetPaymentMethods';
import { ProcessPayment } from '../domain/usecases/ProcessPayment';
import { GetTransactionById } from '../domain/usecases/GetTransactionById';
import { CommentRepositoryImpl } from '../data/repositories/comment/CommentRepositoryImpl';
import { GetCommentsByPostId } from '../domain/usecases/comment/GetCommentsByPostId';
import { CreateComment } from '../domain/usecases/comment/CreateComment';
import { UpdateComment } from '../domain/usecases/comment/UpdateComment';
import { DeleteComment } from '../domain/usecases/comment/DeleteComment';

// --- 3. REPOSITORY INSTANTIATION ---
const authRepository = new AuthRepositoryImpl();
const dailyLogRepository = new DailyLogRepositoryImpl();
const mealLogRepository = new MealLogRepositoryImpl();
const foodRepository = new FoodRepositoryImpl();
const mealFoodRepository = new MealFoodRepositoryImpl();
const exerciseRepository = new ExerciseRepositoryImpl();
const forumRepository = new ForumRepositoryImpl();

const userRepository = new MockUserRepository();
const storageRepository = new StorageRepository();
const healthRepository = new MockHealthRepository();
const chatRepository = new MockChatRepository();
const hospitalRepository = new MockHospitalRepository();
const subscriptionRepository = new MockSubscriptionRepository();

const commentRepository = new CommentRepositoryImpl();
// --- 4. USE CASE INSTANTIATION & EXPORT ---

// Auth
export const loginWithGoogleUseCase = new LoginWithGoogle(authRepository);

// Onboarding & User
export const getUserProfileUseCase = new GetUserProfile(userRepository);
export const checkOnboardingStatusUseCase = new CheckOnboardingStatus(
  storageRepository,
);
export const completeOnboardingUseCase = new CompleteOnboarding(
  storageRepository,
);

// Daily Log & Diary (Core)
export const getDailyLogByDateUseCase = new GetDailyLogByDateUseCase(
  dailyLogRepository,
);
export const createDailyLogUseCase = new CreateDailyLogUseCase(
  dailyLogRepository,
);
export const getMealLogsByDailyLogIdUseCase =
  new GetMealLogsByDailyLogIdUseCase(mealLogRepository);
export const createMealLogUseCase = new CreateMealLogUseCase(mealLogRepository);
export const updateMealLogUseCase = new UpdateMealLogUseCase(mealLogRepository);
export const deleteMealLogUseCase = new DeleteMealLogUseCase(mealLogRepository);

// Food & Meal Management
export const getFoodItemsUseCase = new GetFoodItemsUseCase(foodRepository);
export const getMealFoodsByMealIdUseCase = new GetMealFoodsByMealIdUseCase(
  mealFoodRepository,
);
export const addFoodToMealUseCase = new AddFoodToMealUseCase(
  mealFoodRepository,
);
export const updateMealFoodQuantityUseCase = new UpdateMealFoodQuantityUseCase(
  mealFoodRepository,
);
export const removeFoodFromMealUseCase = new RemoveFoodFromMealUseCase(
  mealFoodRepository,
);

// Exercise Tracking
export const getExerciseTypesUseCase = new GetExerciseTypesUseCase(
  exerciseRepository,
);
export const getExercisesByDailyLogIdUseCase =
  new GetExercisesByDailyLogIdUseCase(exerciseRepository);
export const addExerciseLogUseCase = new AddExerciseLogUseCase(
  exerciseRepository,
);
export const updateExerciseLogUseCase = new UpdateExerciseLogUseCase(
  exerciseRepository,
);
export const removeExerciseLogUseCase = new RemoveExerciseLogUseCase(
  exerciseRepository,
);

// --- Forum (Real Flow cho Quản lý bài viết) ---
//
export const getAllPostsUseCase = new GetAllPosts(forumRepository);
export const createPostUseCase = new CreatePost(forumRepository);
export const uploadMediaUseCase = new UploadMedia(forumRepository);
export const getPostByIdUseCase = new GetPostById(forumRepository);
export const getMyPostsUseCase = new GetMyPosts(forumRepository);
export const updatePostUseCase = new UpdatePost(forumRepository);
export const deletePostUseCase = new DeletePost(forumRepository);

// Health Insights
export const getDailyProgressUseCase = new GetDailyProgress(healthRepository);
export const getHealthInsightsUseCase = new GetHealthInsights(healthRepository);
export const getHealthTipsUseCase = new GetHealthTips(healthRepository);
export const getHeartRateTrendUseCase = new GetHeartRateTrend(healthRepository);
export const getHealthSummaryUseCase = new GetHealthSummary(healthRepository);

// AI Chat
export const sendChatMessageUseCase = new SendChatMessage(chatRepository);
export const getChatSessionUseCase = new GetChatSession(chatRepository);
export const getSuggestedQuestionsUseCase = new GetSuggestedQuestions(
  chatRepository,
);

// Hospital & Facilities
export const searchFacilitiesUseCase = new SearchFacilities(hospitalRepository);
export const suggestFacilitiesBySymptomsUseCase =
  new SuggestFacilitiesBySymptoms(hospitalRepository);
export const getFacilityByIdUseCase = new GetFacilityById(hospitalRepository);

// Subscription & Payment
export const getAllPlansUseCase = new GetAllPlans(subscriptionRepository);
export const getPlanByIdUseCase = new GetPlanById(subscriptionRepository);
export const getPaymentMethodsUseCase = new GetPaymentMethods(
  subscriptionRepository,
);
export const processPaymentUseCase = new ProcessPayment(subscriptionRepository);
export const getTransactionByIdUseCase = new GetTransactionById(
  subscriptionRepository,
);

export const getCommentsByPostIdUseCase = new GetCommentsByPostId(
  commentRepository,
);
export const createCommentUseCase = new CreateComment(commentRepository);
export const updateCommentUseCase = new UpdateComment(commentRepository);
export const deleteCommentUseCase = new DeleteComment(commentRepository);