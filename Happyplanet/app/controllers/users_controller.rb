class UsersController < ApplicationController


  before_action :authorise_user, :except => [:index, :new, :create]
  before_action :check_for_user, :only => [:edit, :update]

  def new
    @user = User.new
  end

  def create
    @user = User.new user_params
    if @user.save
      session[:user_id] = @user.id
      redirect_to root_path
    else
      render :new
    end
  end


  def index
    @users = User.all
  end


  def edit
    @user = @current_user
  end

  def show
      @user = @current_user

  end


  def update
      @user = @current_user

    if @user.update user_params
      redirect_to root_path
    else
      render :edit
    end
  end


  private
      def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
      end

      def authorise_user
        redirect_to root_path unless @current_user.present?
      end

      def check_for_user
        redirect_to new_user_path unless @current_user.present?
      end


end
