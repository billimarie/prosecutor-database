class AttorneysController < ApplicationController
	before_action :set_attorney, only: [:show, :edit, :update, :destroy]
	
  def index
  end

  def show
  end

  def new
  end

  def create
  end

  def edit
  end

  def update
  end

  def destroy
  end

  private

  def set_attorney
    @attorney = Attorney.find(params[:id])
  end
end
