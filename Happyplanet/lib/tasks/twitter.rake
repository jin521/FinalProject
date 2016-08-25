namespace :twitter do

  desc 'search tweets'
  task :search, [:query, :limit] => :environment do |t, args|
    # require 'pry'
    $client.search(args['query'], result_type: "recent", lang: "en").take(args['limit'].to_i).each do |tweet|
      puts tweet.text
      # puts tweet.geo
      # puts tweet.place
      # puts tweet.hashtags



      # saving these tweets to post table
      @tweet = Post.create(description:tweet.text )


      # binding.pry
    end

  end
end
