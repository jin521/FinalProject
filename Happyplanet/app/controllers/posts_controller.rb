class PostsController < ApplicationController

  def index
    @posts = Post.all

  end



  def new
  end

  def create
    @post = Post.new(post_params)
    @post.save
    redirect_to @post

  end

  def show
    @post = Post.find(params[:id])
  end

  def get_posts
    all_posts = Post.all
    render json: {posts: all_posts}, :status => :ok
  end





private
def post_params
    params.require(:post).permit(:description)
end


end
