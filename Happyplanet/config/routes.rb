Rails.application.routes.draw do
  resources :posts
  resources :pages
  root "pages#index"
end
