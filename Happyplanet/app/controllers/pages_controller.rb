class PagesController < ApplicationController

  def home

  end


  def submit_form
    if post.user_id = @current_user.id
       post.save
     end
    render json: {posts: post}, :status => :ok # return JSON to the ajax call
  end





end
