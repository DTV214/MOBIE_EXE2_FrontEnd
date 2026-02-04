// --- 1. DATA LAYER (REPOSITORIES) ---
// Mocks
import { MockUserRepository } from '../data/repositories/MockUserRepository';
import { StorageRepository } from '../data/repositories/StorageRepository';
import { MockHealthRepository } from '../data/repositories/MockHealthRepository';
import { MockMealRepository } from '../data/repositories/MockMealRepository';
import { MockForumRepository } from '../data/repositories/MockForumRepository';
import { MockChatRepository } from '../data/repositories/MockChatRepository';
import { MockHospitalRepository } from '../data/repositories/MockHospitalRepository';
import { MockSubscriptionRepository } from '../data/repositories/MockSubscriptionRepository';

// Real Implementations (API)
import { AuthRepositoryImpl } from '../data/repositories/auth/AuthRepositoryImpl';
import { DailyLogRepositoryImpl } from '../data/repositories/daily-log/DailyLogRepositoryImpl';

// --- 2. DOMAIN LAYER (USE CASES) ---
// Auth
import { LoginWithGoogle } from '../domain/usecases/auth/LoginWithGoogle';

// Onboarding & Profile
import { GetUserProfile } from '../domain/usecases/GetUserProfile';
import { CheckOnboardingStatus } from '../domain/usecases/CheckOnboardingStatus';
import { CompleteOnboarding } from '../domain/usecases/CompleteOnboarding';

// Daily Log & Tracking (The Core Diary)
import { GetDailyLogByDateUseCase } from '../domain/usecases/daily-log/GetDailyLogByDate';
import { CreateDailyLogUseCase } from '../domain/usecases/daily-log/CreateDailyLog';

// Meal Log (Sub-flow of Daily Log)
import { GetMealLogsByDailyLogIdUseCase } from '../domain/usecases/daily-log/GetMealLogsByDailyLogId';
import { CreateMealLogUseCase } from '../domain/usecases/daily-log/meal-log/CreateMealLog';
import { UpdateMealLogUseCase } from '../domain/usecases/daily-log/meal-log/UpdateMealLog';
import { DeleteMealLogUseCase } from '../domain/usecases/daily-log/meal-log/DeleteMealLog';
// Others (Health, Forum, Hospital, etc.)
import { GetDailyProgress } from '../domain/usecases/GetDailyProgress';
import { GetHealthInsights } from '../domain/usecases/GetHealthInsights';
import { GetHealthTips } from '../domain/usecases/GetHealthTips';
import { GetHeartRateTrend } from '../domain/usecases/GetHeartRateTrend';
import { GetHealthSummary } from '../domain/usecases/GetHealthSummary';
import { GetDailyMeal } from '../domain/usecases/GetDailyMeal';
import { SearchFoods } from '../domain/usecases/SearchFoods';
import { GetFoodById } from '../domain/usecases/GetFoodById';
import { AddMealItem } from '../domain/usecases/AddMealItem';
import { RemoveMealItem } from '../domain/usecases/RemoveMealItem';
import { GetAllPosts } from '../domain/usecases/GetAllPosts';
import { CreatePost } from '../domain/usecases/CreatePost';
import { LikePost } from '../domain/usecases/LikePost';
import { GetSuggestedTopics } from '../domain/usecases/GetSuggestedTopics';
import { GetTrendingDiscussions } from '../domain/usecases/GetTrendingDiscussions';
import { GetPostById } from '../domain/usecases/GetPostById';
import { GetCommentsByPostId } from '../domain/usecases/GetCommentsByPostId';
import { CreateComment } from '../domain/usecases/CreateComment';
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
import { MealLogRepositoryImpl } from '../data/repositories/daily-log/meal-log/MealLogRepositoryImpl';

// --- 3. REPOSITORY INSTANTIATION ---
const userRepository = new MockUserRepository();
const storageRepository = new StorageRepository();
const healthRepository = new MockHealthRepository();
const mealRepository = new MockMealRepository(); // Vẫn giữ mock cho các chức năng cũ
const forumRepository = new MockForumRepository();
const chatRepository = new MockChatRepository();
const hospitalRepository = new MockHospitalRepository();
const subscriptionRepository = new MockSubscriptionRepository();

// Real API Repositories
const authRepository = new AuthRepositoryImpl();
const dailyLogRepository = new DailyLogRepositoryImpl();
const mealLogRepository = new MealLogRepositoryImpl();

// --- 4. USE CASE INSTANTIATION & EXPORT ---

// --- Tracking & Diary (LÀNH CARE CORE) ---
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

// --- Auth ---
export const loginWithGoogleUseCase = new LoginWithGoogle(authRepository);

// --- User & Onboarding ---
export const getUserProfileUseCase = new GetUserProfile(userRepository);
export const checkOnboardingStatusUseCase = new CheckOnboardingStatus(
  storageRepository,
);
export const completeOnboardingUseCase = new CompleteOnboarding(
  storageRepository,
);

// --- Health ---
export const getDailyProgressUseCase = new GetDailyProgress(healthRepository);
export const getHealthInsightsUseCase = new GetHealthInsights(healthRepository);
export const getHealthTipsUseCase = new GetHealthTips(healthRepository);
export const getHeartRateTrendUseCase = new GetHeartRateTrend(healthRepository);
export const getHealthSummaryUseCase = new GetHealthSummary(healthRepository);

// --- Meal & Food (Old) ---
export const getDailyMealUseCase = new GetDailyMeal(mealRepository);
export const searchFoodsUseCase = new SearchFoods(mealRepository);
export const getFoodByIdUseCase = new GetFoodById(mealRepository);
export const addMealItemUseCase = new AddMealItem(mealRepository);
export const removeMealItemUseCase = new RemoveMealItem(mealRepository);

// --- Forum ---
export const getAllPostsUseCase = new GetAllPosts(forumRepository);
export const createPostUseCase = new CreatePost(forumRepository);
export const likePostUseCase = new LikePost(forumRepository);
export const getSuggestedTopicsUseCase = new GetSuggestedTopics(
  forumRepository,
);
export const getTrendingDiscussionsUseCase = new GetTrendingDiscussions(
  forumRepository,
);
export const getPostByIdUseCase = new GetPostById(forumRepository);
export const getCommentsByPostIdUseCase = new GetCommentsByPostId(
  forumRepository,
);
export const createCommentUseCase = new CreateComment(forumRepository);

// --- AI Chat ---
export const sendChatMessageUseCase = new SendChatMessage(chatRepository);
export const getChatSessionUseCase = new GetChatSession(chatRepository);
export const getSuggestedQuestionsUseCase = new GetSuggestedQuestions(
  chatRepository,
);

// --- Hospital ---
export const searchFacilitiesUseCase = new SearchFacilities(hospitalRepository);
export const suggestFacilitiesBySymptomsUseCase =
  new SuggestFacilitiesBySymptoms(hospitalRepository);
export const getFacilityByIdUseCase = new GetFacilityById(hospitalRepository);

// --- Subscription ---
export const getAllPlansUseCase = new GetAllPlans(subscriptionRepository);
export const getPlanByIdUseCase = new GetPlanById(subscriptionRepository);
export const getPaymentMethodsUseCase = new GetPaymentMethods(
  subscriptionRepository,
);
export const processPaymentUseCase = new ProcessPayment(subscriptionRepository);
export const getTransactionByIdUseCase = new GetTransactionById(
  subscriptionRepository,
);
