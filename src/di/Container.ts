import { MockUserRepository } from '../data/repositories/MockUserRepository';
import { StorageRepository } from '../data/repositories/StorageRepository';
import { MockHealthRepository } from '../data/repositories/MockHealthRepository';
import { MockMealRepository } from '../data/repositories/MockMealRepository';
import { MockForumRepository } from '../data/repositories/MockForumRepository';
import { MockChatRepository } from '../data/repositories/MockChatRepository';
import { MockHospitalRepository } from '../data/repositories/MockHospitalRepository';
import { MockSubscriptionRepository } from '../data/repositories/MockSubscriptionRepository';
import { GetUserProfile } from '../domain/usecases/GetUserProfile';
import { CheckOnboardingStatus } from '../domain/usecases/CheckOnboardingStatus';
import { CompleteOnboarding } from '../domain/usecases/CompleteOnboarding';
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

import { AuthRepositoryImpl } from '../data/repositories/auth/AuthRepositoryImpl';
import { LoginWithGoogle } from '../domain/usecases/auth/LoginWithGoogle';

// NEW: Hospital & Medical Specialty imports
import { HospitalRepositoryImpl } from '../data/repositories/hospital/HospitalRepositoryImpl';
import { MedicalSpecialtyRepositoryImpl } from '../data/repositories/specialty/MedicalSpecialtyRepositoryImpl';
import { GetAllHospitals } from '../domain/usecases/hospital/GetAllHospitals';
import { GetHospitalDetail } from '../domain/usecases/hospital/GetHospitalDetail';
import { GetHospitalsBySpecialty } from '../domain/usecases/hospital/GetHospitalsBySpecialty';
import { GetHospitalSpecialties } from '../domain/usecases/specialty/GetHospitalSpecialties';
import { GetSpecialtyDetail } from '../domain/usecases/specialty/GetSpecialtyDetail';
// Repositories - Sau này có API thật thì chỉ cần đổi dòng này là xong
const userRepository = new MockUserRepository();
const storageRepository = new StorageRepository();
const healthRepository = new MockHealthRepository();
const mealRepository = new MockMealRepository();
const forumRepository = new MockForumRepository();
const chatRepository = new MockChatRepository();
const hospitalRepository = new MockHospitalRepository();
const subscriptionRepository = new MockSubscriptionRepository();
const authRepository = new AuthRepositoryImpl();

// NEW: Real API repositories
const hospitalNewRepository = new HospitalRepositoryImpl();
const medicalSpecialtyRepository = new MedicalSpecialtyRepositoryImpl();
// Use Cases
export const getUserProfileUseCase = new GetUserProfile(userRepository);
export const checkOnboardingStatusUseCase = new CheckOnboardingStatus(storageRepository);
export const completeOnboardingUseCase = new CompleteOnboarding(storageRepository);
export const getDailyProgressUseCase = new GetDailyProgress(healthRepository);
export const getHealthInsightsUseCase = new GetHealthInsights(healthRepository);
export const getHealthTipsUseCase = new GetHealthTips(healthRepository);
export const getHeartRateTrendUseCase = new GetHeartRateTrend(healthRepository);
export const getHealthSummaryUseCase = new GetHealthSummary(healthRepository);
export const getDailyMealUseCase = new GetDailyMeal(mealRepository);
export const searchFoodsUseCase = new SearchFoods(mealRepository);
export const getFoodByIdUseCase = new GetFoodById(mealRepository);
export const addMealItemUseCase = new AddMealItem(mealRepository);
export const removeMealItemUseCase = new RemoveMealItem(mealRepository);
export const getAllPostsUseCase = new GetAllPosts(forumRepository);
export const createPostUseCase = new CreatePost(forumRepository);
export const likePostUseCase = new LikePost(forumRepository);
export const getSuggestedTopicsUseCase = new GetSuggestedTopics(forumRepository);
export const getTrendingDiscussionsUseCase = new GetTrendingDiscussions(forumRepository);
export const getPostByIdUseCase = new GetPostById(forumRepository);
export const getCommentsByPostIdUseCase = new GetCommentsByPostId(forumRepository);
export const createCommentUseCase = new CreateComment(forumRepository);
export const sendChatMessageUseCase = new SendChatMessage(chatRepository);
export const getChatSessionUseCase = new GetChatSession(chatRepository);
export const getSuggestedQuestionsUseCase = new GetSuggestedQuestions(chatRepository);
export const searchFacilitiesUseCase = new SearchFacilities(hospitalRepository);
export const suggestFacilitiesBySymptomsUseCase = new SuggestFacilitiesBySymptoms(hospitalRepository);
export const getFacilityByIdUseCase = new GetFacilityById(hospitalRepository);
export const getAllPlansUseCase = new GetAllPlans(subscriptionRepository);
export const getPlanByIdUseCase = new GetPlanById(subscriptionRepository);
export const getPaymentMethodsUseCase = new GetPaymentMethods(subscriptionRepository);
export const processPaymentUseCase = new ProcessPayment(subscriptionRepository);
export const getTransactionByIdUseCase = new GetTransactionById(subscriptionRepository);
export const loginWithGoogleUseCase = new LoginWithGoogle(authRepository);

// NEW: Hospital & Medical Specialty Use Cases  
export const getAllHospitalsUseCase = new GetAllHospitals(hospitalNewRepository);
export const getHospitalDetailUseCase = new GetHospitalDetail(hospitalNewRepository);
export const getHospitalsBySpecialtyUseCase = new GetHospitalsBySpecialty(hospitalNewRepository);
export const getHospitalSpecialtiesUseCase = new GetHospitalSpecialties(medicalSpecialtyRepository);
export const getSpecialtyDetailUseCase = new GetSpecialtyDetail(medicalSpecialtyRepository);

// Export authRepository for direct access
export { authRepository };