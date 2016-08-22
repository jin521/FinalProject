Rails.application.routes.draw do


  resources :posts
  resources :pages
  resources :users
  root "pages#home"

  get'/pages/signup' =>'pages#signup'


  get '/login' => 'session#new'         # This will be our sign-in page.
  post '/login' => 'session#create'     # This will be the path to which the sign-in form is posted
  delete '/login' => 'session#destroy'  # This will be the path users use to log-out.


  get '/getposts' => 'posts#get_posts'     #routing for Ajax only
end
