namespace :twitter do

  desc 'search tweets'
  task :search, [:query, :limit] => :environment do |t, args|

    $client.search(args['query'], result_type: "recent", lang: "en").take(args['limit'].to_i).each do |tweet|
      puts tweet.text
      @tweet =Tweet.create(post:tweet.text)


    end

  end
end
