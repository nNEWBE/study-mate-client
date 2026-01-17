import { ReactNode } from "react";

export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    providerData: {
        uid: string;
        displayName: string | null;
        email: string | null;
        photoURL: string | null;
        providerId: string;
    }[];
}

export interface UserCredential {
    user: User;
    providerId: string | null;
}

// Auth Context Types
export interface AuthContextType {
    user: User | null;
    loading: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    logoutUser: () => void;
    signInWithGoogle: () => Promise<UserCredential>;
    signInWithGithub: () => Promise<UserCredential>;
    updateUserProfile: (name: string, image: string) => Promise<void>;
}

// Toggle Context Types
export interface ToggleContextType {
    toggle: boolean;
    setToggle: React.Dispatch<React.SetStateAction<boolean>>;
    handleToggleSidebar: () => void;
}

// Component Props Types
export interface ChildrenProps {
    children: ReactNode;
}

// Assignment Types
export interface Review {
    userEmail: string;
    userName: string;
    rating: number;
    feedback: string;
    createdAt: string;
}

export interface Assignment {
    _id: string;
    title: string;
    description: string;
    content?: string;
    marks: number | string;
    thumbnail?: string;
    thumbnailUrl?: string[];
    photoURL?: string;
    difficulty: "easy" | "medium" | "hard" | string;
    dueDate?: string;
    dueTime?: string; // Format: "HH:mm" (24-hour format)
    date?: string;
    isExpired?: boolean;
    isBestAssignment?: boolean;
    totalSubmissions?: number;
    reviews?: Review[];
    averageRating?: number;
    creatorEmail?: string;
    creatorName?: string;
    creatorPhoto?: string;
    categoryId?: string;
    status?: string;
    createdBy?: {
        name?: string;
        email?: string;
        role?: string;
        profileImage?: string;
    };
    person?: {
        name?: string | null;
        email?: string | null;
        photo?: string | null;
    };
    createdAt?: string;
    updatedAt?: string;
}

// Submission Types
export interface Submission {
    _id: string;
    assignmentId: string;
    assignmentTitle: string;
    studentEmail: string;
    studentName?: string;
    pdfLink: string;
    quickNote: string;
    status: "pending" | "completed";
    marks?: number;
    feedback?: string;
    submittedAt: string;
}

// Form Data Types
export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    photoURL?: string;
}

export interface AssignmentFormData {
    title: string;
    description: string;
    marks: number;
    thumbnail: string;
    difficulty: "easy" | "medium" | "hard";
    dueDate: Date | null;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// Lottie Animation Types
export interface LottieAnimationData {
    v: string;
    fr: number;
    ip: number;
    op: number;
    w: number;
    h: number;
    nm: string;
    ddd: number;
    assets: unknown[];
    layers: unknown[];
}
