Rails.application.routes.draw do
  get 'cases/index'

  get 'cases/show'

  get 'cases/new'

  get 'cases/edit'

  get 'attorneys/index'

  get 'attorneys/show'

  get 'attorneys/new'

  get 'attorneys/edit'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
