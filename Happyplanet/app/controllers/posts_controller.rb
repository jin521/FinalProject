class PostsController < ApplicationController

  def index

      @posts = Post.where(params[:user_id] = @current_user.id)
  end



  def new
  end

  def create
    post = Post.new(post_params)
    ip_address = request.ip
    post.location = Geocoder.search(ip_address).first.city
    post.user_id = @current_user.id
    post.save
    # binding.pry
    # redirect_to user_path @current_user

    respond_to do |format|
      format.html { redirect_to user_path @current_user }
      format.js   { render json: {hi: "ok"}, status: :ok }
    end

  end

  def show
    @post = Post.find(params[:id])
  end



  def edit
  end

  def update
    @post.update post_params
    redirect_to @post
  end


  def destroy
    @post = Post.find(params[:id])
    @post.destroy
    redirect_to user_path
  end



  def get_posts
    all_posts = Post.where.not(:description => "").limit(100)
    render json: {posts: all_posts}, :status => :ok
  end





private
def post_params
    params.require(:post).permit(:description, )
end


end
