require 'sinatra'
require 'json'

set :port, ENV.fetch('PORT', 3000).to_i

get '/' do
  content_type :json
  {
    message: 'Hello from envlock + Ruby',
    secret: ENV['API_SECRET'] ? '[set]' : '[missing]',
    env: ENV['APP_ENV'] || 'unknown'
  }.to_json
end
