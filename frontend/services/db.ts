import { auth } from './firebase';
import { User, AnalysisHistory, DetectionResult } from '../types';

// Use VITE_API_URL environment variable for production, fallback to relative path for dev proxy
const API_BASE = import.meta.env.VITE_API_URL || '';
const API_URL = `${API_BASE}/api`;

const getAuthHeaders = async () => {
    const user = auth.currentUser;
    if (!user) return {};
    const token = await user.getIdToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const DbService = {
    // --- User Operations ---

    async saveUser(user: User) {
        if (!user.id) return;
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/user`, {
                method: 'POST',
                headers,
                body: JSON.stringify(user)
            });
            if (!response.ok) throw new Error('Failed to save user');
        } catch (error) {
            console.error('DbService saveUser error:', error);
        }
    },

    async getUser(userId: string): Promise<User | null> {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/user/${userId}`, {
                method: 'GET',
                headers
            });
            if (response.status === 404) return null;
            if (!response.ok) throw new Error('Failed to get user');
            return await response.json();
        } catch (error) {
            console.error('DbService getUser error:', error);
            return null;
        }
    },

    async updateUserCredits(userId: string, newCredits: number) {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/user/${userId}/credits`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ credits: newCredits })
            });
            if (!response.ok) throw new Error('Failed to update credits');
        } catch (error) {
            console.error('DbService updateUserCredits error:', error);
        }
    },

    // --- Analysis Operations ---

    async saveAnalysis(userId: string, result: DetectionResult, fileBase64: string, mimeType: string): Promise<AnalysisHistory> {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/analysis`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ userId, result, fileBase64, mimeType })
            });
            if (!response.ok) throw new Error('Failed to save analysis');
            return await response.json();
        } catch (error) {
            console.error('DbService saveAnalysis error:', error);
            throw error;
        }
    },

    async getUserHistory(userId: string): Promise<AnalysisHistory[]> {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/history/${userId}`, {
                method: 'GET',
                headers
            });
            if (!response.ok) throw new Error('Failed to get history');
            return await response.json();
        } catch (error) {
            console.error('DbService getUserHistory error:', error);
            return [];
        }
    },

    async clearUserHistory(userId: string): Promise<void> {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/analysis/${userId}`, {
                method: 'DELETE',
                headers
            });
            if (!response.ok) throw new Error('Failed to clear history');
        } catch (error) {
            console.error('DbService clearUserHistory error:', error);
        }
    },

    // --- Admin Operations ---

    async getAllUsers(): Promise<User[]> {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/admin/users`, {
                method: 'GET',
                headers
            });
            if (!response.ok) throw new Error('Failed to get users');
            return await response.json();
        } catch (error) {
            console.error('DbService getAllUsers error:', error);
            return [];
        }
    },

    async getAlerts(): Promise<any[]> {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/admin/alerts`, {
                method: 'GET',
                headers
            });
            if (!response.ok) throw new Error('Failed to get alerts');
            return await response.json();
        } catch (error) {
            console.error('DbService getAlerts error:', error);
            return [];
        }
    },

    // --- Credit Request Operations ---

    async requestCredits(request: { userId: string, userEmail: string, amount: number, packLabel: string, price: string }) {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/credits/request`, {
                method: 'POST',
                headers,
                body: JSON.stringify(request)
            });
            if (!response.ok) throw new Error('Failed to submit credit request');
            return await response.json();
        } catch (error) {
            console.error('DbService requestCredits error:', error);
            throw error;
        }
    },

    async getCreditRequests(): Promise<import('../types').CreditRequest[]> {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/admin/credit-requests`, {
                method: 'GET',
                headers
            });
            if (!response.ok) throw new Error('Failed to get credit requests');
            return await response.json();
        } catch (error) {
            console.error('DbService getCreditRequests error:', error);
            return [];
        }
    },

    async approveCreditRequest(requestId: string) {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/admin/credit-requests/${requestId}/approve`, {
                method: 'POST',
                headers
            });
            if (!response.ok) throw new Error('Failed to approve request');
            return true;
        } catch (error) {
            console.error('DbService approveCreditRequest error:', error);
            return false;
        }
    },

    async rejectCreditRequest(requestId: string) {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/admin/credit-requests/${requestId}/reject`, {
                method: 'POST',
                headers
            });
            if (!response.ok) throw new Error('Failed to reject request');
            return true;
        } catch (error) {
            console.error('DbService rejectCreditRequest error:', error);
            return false;
        }
    }
};

