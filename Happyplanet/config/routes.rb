Rails.application.routes.draw do

  root "pages#home"

  resources :posts
  get '/user/:id/posts/' => 'posts#index', :as =>'user_posts'
  resources :pages
  resources :users



  get '/login' => 'sessions#new'         # This will be our sign-in page.
  post '/login' => 'sessions#create'     # This will be the path to which the sign-in form is posted
  delete '/logout' => 'sessions#destroy'  # This will be the path users use to log-out.


  get '/getposts' => 'posts#get_posts'     #routing for Ajax only
end
