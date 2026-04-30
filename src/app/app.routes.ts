import { Routes } from '@angular/router';

import { authGuard, roleGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/landing/landing.page').then((m) => m.LandingPage),
        title: 'QaliKay — Sabiduría andina, bienestar moderno',
      },

      {
        path: 'login',
        loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage),
        title: 'Ingresar · QaliKay',
      },
      {
        path: 'register/cliente',
        loadComponent: () =>
          import('./features/auth/register-cliente.page').then((m) => m.RegisterClientePage),
        title: 'Crear cuenta · QaliKay',
      },
      {
        path: 'register/experto',
        loadComponent: () =>
          import('./features/auth/register-experto.page').then((m) => m.RegisterExpertoPage),
        title: 'Postular como experto · QaliKay',
      },

      {
        path: 'recipes',
        loadComponent: () =>
          import('./features/recipes/pages/recipes-list.page').then((m) => m.RecipesListPage),
        title: 'Recetas · QaliKay',
      },
      {
        path: 'recipes/:id',
        loadComponent: () =>
          import('./features/recipes/pages/recipe-detail.page').then((m) => m.RecipeDetailPage),
      },

      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/pages/products-list.page').then((m) => m.ProductsListPage),
        title: 'Insumos · QaliKay',
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./features/products/pages/product-detail.page').then((m) => m.ProductDetailPage),
      },

      {
        path: 'me',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/me/client-dashboard.page').then((m) => m.ClientDashboardPage),
        title: 'Mi panel · QaliKay',
      },
      {
        path: 'expert',
        canActivate: [authGuard, roleGuard(['EXPERTO'])],
        loadComponent: () =>
          import('./features/expert/expert-dashboard.page').then((m) => m.ExpertDashboardPage),
        title: 'Panel del experto · QaliKay',
      },
      {
        path: 'expert/recipes',
        canActivate: [authGuard, roleGuard(['EXPERTO'])],
        loadComponent: () =>
          import('./features/expert/pages/my-recipes.page').then((m) => m.MyRecipesPage),
        title: 'Mis recetas · QaliKay',
      },
      {
        path: 'expert/recipes/new',
        canActivate: [authGuard, roleGuard(['EXPERTO'])],
        loadComponent: () =>
          import('./features/expert/pages/recipe-form.page').then((m) => m.RecipeFormPage),
        title: 'Nueva receta · QaliKay',
      },
      {
        path: 'expert/recipes/:id/edit',
        canActivate: [authGuard, roleGuard(['EXPERTO'])],
        loadComponent: () =>
          import('./features/expert/pages/recipe-form.page').then((m) => m.RecipeFormPage),
        title: 'Editar receta · QaliKay',
      },

      {
        path: '**',
        loadComponent: () =>
          import('./features/errors/not-found.page').then((m) => m.NotFoundPage),
        title: 'Página no encontrada · QaliKay',
      },
    ],
  },
];
