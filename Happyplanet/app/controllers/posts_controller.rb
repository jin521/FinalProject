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
    redirect_to user_path @current_user

  end

  def show
    @post = Post.find(params[:id])
  end



  def edit
    redirect_to edit_post_path
  end

  def update
    @post.update post_params
    redirect_to @post
  end



  def destroy
    @post.destroy
    redirect_to post_path
  end




  def get_posts
    all_posts = Post.where.not(:description => "")
    render json: {posts: all_posts}, :status => :ok
  end

  def post_new
     posts = Post.where()
  end



private
def post_params
    params.require(:post).permit(:description, )
end


end
