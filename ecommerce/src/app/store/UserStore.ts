import { signalStore, withState, withMethods, withHooks, patchState, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject, Injectable } from '@angular/core';
import { pipe, switchMap, tap, catchError, of, EMPTY } from 'rxjs';
import { UserService } from '../services/user/user-service';
import { user, UserCartResponse, userLoginReq, UserOrderResponse, userReq, UserWishlistResponse } from '../types/i-user';
import { tapResponse } from '@ngrx/operators';

// State interface
export interface UserState {
  users: user[];
  currentUser: user | null;
  userCart: UserCartResponse | null;
  userOrders: UserOrderResponse | null;
  userWishlist: UserWishlistResponse | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Initial state
const initialState: UserState = {
  users: [],
  currentUser: null,
  userCart: null,
  userOrders: null,
  userWishlist: null,
  loading: false,
  error: null,
  lastUpdated: null
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  
  withComputed(({ users, currentUser, loading }) => ({
    // Computed signals for derived state
    totalUsers: () => users().length,
    activeUsers: () => users().filter(user => user.is_active).length,
    adminUsers: () => users().filter(user => user.userType === 'Admin').length,
    isAuthenticated: () => currentUser() !== null && currentUser()?.is_active === true,
    isLoading: () => loading(),
  })),
  
  withMethods((store, userService = inject(UserService)) => ({
    // Helper method to set loading state
    setLoading(loading: boolean) {
      patchState(store, { loading, error: loading ? null : store.error() });
    },

    // Helper method to set error
    setError(error: string | null) {
      patchState(store, { error, loading: false });
    },

    // Load all users
    loadAllUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() => 
          userService.getAllUsers().pipe(
            tapResponse({
              next: (users) => patchState(store, { 
                users, 
                loading: false,
                lastUpdated: new Date()
              }),
              error: (error: Error) => patchState(store, { 
                error: error.message, 
                loading: false 
              })
            })
          )
        )
      )
    ),

    // Load user by ID
    loadUserById: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((id) => 
          userService.getUserById(id).pipe(
            tapResponse({
              next: (user) => patchState(store, { 
                currentUser: user, 
                loading: false,
                lastUpdated: new Date()
              }),
              error: (error: Error) => patchState(store, { 
                error: error.message, 
                loading: false 
              })
            })
          )
        )
      )
    ),

    // Load user orders
    loadUserOrders: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((id) => 
          userService.getUserOrders(id).pipe(
            tapResponse({
              next: (userOrders) => patchState(store, { 
                userOrders, 
                loading: false,
                lastUpdated: new Date()
              }),
              error: (error: Error) => patchState(store, { 
                error: error.message, 
                loading: false 
              })
            })
          )
        )
      )
    ),

    // Load user cart
    loadUserCart: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((id) => 
          userService.getUserCart(id).pipe(
            tapResponse({
              next: (userCart) => patchState(store, { 
                userCart, 
                loading: false,
                lastUpdated: new Date()
              }),
              error: (error: Error) => patchState(store, { 
                error: error.message, 
                loading: false 
              })
            })
          )
        )
      )
    ),

    // Load user wishlist
    loadUserWishlist: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((id) => 
          userService.getUserWishlist(id).pipe(
            tapResponse({
              next: (userWishlist) => patchState(store, { 
                userWishlist, 
                loading: false,
                lastUpdated: new Date()
              }),
              error: (error: Error) => patchState(store, { 
                error: error.message, 
                loading: false 
              })
            })
          )
        )
      )
    ),

    // Register user
    registerUser: rxMethod<userReq>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((userReq) => 
          userService.registerUser(userReq).pipe(
            tapResponse({
              next: (newUser) => patchState(store, (state) => ({ 
                users: [...state.users, newUser],
                currentUser: newUser,
                loading: false,
                lastUpdated: new Date()
              })),
              error: (error: Error) => patchState(store, { 
                error: error.message, 
                loading: false 
              })
            })
          )
        )
      )
    ),

    // Login
    login: rxMethod<userLoginReq>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((loginRequest) => 
          userService.login(loginRequest).pipe(
            tapResponse({
              next: (user) => patchState(store, { 
                currentUser: user,
                loading: false,
                lastUpdated: new Date()
              }),
              error: (error: Error) => patchState(store, { 
                error: error.message, 
                loading: false 
              })
            })
          )
        )
      )
    ),

    // Edit user
    editUser: rxMethod<{ id: number; user: userReq }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ id, user }) => 
          userService.editUser(id, user).pipe(
            tapResponse({
              next: (updatedUser) => patchState(store, (state) => ({ 
                users: state.users.map(u => u.id === id ? updatedUser : u),
                currentUser: state.currentUser?.id === id ? updatedUser : state.currentUser,
                loading: false,
                lastUpdated: new Date()
              })),
              error: (error: Error) => patchState(store, { 
                error: error.message, 
                loading: false 
              })
            })
          )
        )
      )
    ),

    // Delete user
    deleteUser: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((id) => 
          userService.deleteUser(id).pipe(
            tapResponse({
              next: () => patchState(store, (state) => ({ 
                users: state.users.filter(u => u.id !== id),
                currentUser: state.currentUser?.id === id ? null : state.currentUser,
                loading: false,
                lastUpdated: new Date()
              })),
              error: (error: Error) => patchState(store, { 
                error: error.message, 
                loading: false 
              })
            })
          )
        )
      )
    ),

    // Manual state updates
    clearCurrentUser() {
      patchState(store, { currentUser: null });
    },

    clearCart() {
      patchState(store, { userCart: null });
    },

    clearOrders() {
      patchState(store, { userOrders: null });
    },

    clearWishlist() {
      patchState(store, { userWishlist: null });
    },

    clearError() {
      patchState(store, { error: null });
    },

    // Reset entire store
    reset() {
      patchState(store, initialState);
    },

    // Update a specific user in the list 
    updateUserInList(updatedUser: user) {
      patchState(store, (state) => ({
        users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
      }));
    },

    // Add a user to the list 
    addUserToList(newUser: user) {
      patchState(store, (state) => ({
        users: [...state.users, newUser]
      }));
    },

    // Remove a user from the list 
    removeUserFromList(userId: number) {
      patchState(store, (state) => ({
        users: state.users.filter(u => u.id !== userId)
      }));
    }
  })),
  
);