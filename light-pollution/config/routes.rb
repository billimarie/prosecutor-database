Rails.application.routes.draw do

  resources :attorneys do
  	resources :cases
  end

  root 'attorneys#index' 

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
