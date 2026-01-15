// Redux Store Types and Hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Re-export all API hooks from feature modules
// Auth
export {
    useRegisterMutation,
    useLoginMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
} from './features/auth/authApi';

// Auth Slice Actions
export { setUser, setLoading, logout } from './features/auth/authSlice';

// Users
export {
    useGetAllUsersQuery,
    useUpdateUserMutation,
    useChangeUserStatusMutation,
    useGetMeQuery,
} from './features/users/userApi';

// Assignments
export {
    useGetAssignmentsQuery,
    useGetAssignmentByIdQuery,
    useCreateAssignmentMutation,
    useUpdateAssignmentMutation,
    useDeleteAssignmentMutation,
} from './features/assignments/assignmentApi';

// Submissions
export {
    useCreateSubmissionMutation,
    useGetAllSubmissionsQuery,
    useGetMySubmissionsQuery,
    useGetSubmissionByIdQuery,
    useUpdateSubmissionMutation,
} from './features/submissions/submissionApi';

// Categories
export {
    useCreateCategoryMutation,
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} from './features/categories/categoryApi';

// Wishlist
export {
    useAddToWishlistMutation,
    useGetWishlistQuery,
    useRemoveFromWishlistMutation,
} from './features/wishlist/wishlistApi';

// Reviews
export {
    useCreateReviewMutation,
    useGetAllReviewsQuery,
} from './features/reviews/reviewApi';

// Role Requests
export {
    useCreateRoleRequestMutation,
    useGetMyRoleRequestsQuery,
    useGetAllRoleRequestsQuery,
    useUpdateRoleRequestMutation,
} from './features/roleRequests/roleRequestApi';

// Export Store
export { store } from './store';
