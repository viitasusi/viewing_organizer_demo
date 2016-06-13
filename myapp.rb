require 'json'
require 'sinatra'
require 'slim'


eka = "eka"


get '/' do
 slim :index
end

get '/:property/:viewing' do
 "he #{params[:property]} #{params[:viewing]}"
end

get '/example' do
 content_type :json
 {gigs: [
     {address: "Helsinginkatu 17 B 31 00500 Helsinki", time:"Mon, 18 Jan 2016 11:37:22 UTC +00:00", participants: [{name: 'Peter Parker', status: 'confirmed', phone: '+4411223344', email: 'spiderman@dc-comics.com'}, {name: "Captain America", status: 'confirmed', phone: '+4411223344', email: 'captain@america.com'}, {name: "Captain Finland", status: 'confirmed', phone: '+4411223344', email: 'captain@finland.fi'}]},
     {address: "Helsinginkatu 1 00500 Helsinki", time:"Mon, 18 Jan 2016 12:37:22 UTC +00:00", participants: [{name: 'Peter Parker', status: 'confirmed', phone: '+4411223344', email: 'spiderman@dc-comics.com'}, {name: "Captain America", status: 'confirmed', phone: '+4411223344', email: 'captain@america.com'}, {name: "Captain Finland", status: 'confirmed', phone: '+4411223344', email: 'captain@finland.fi'}]},
     {address: "Torikatu 12 B 22 70110 Kuopio", time:"Mon, 18 Jan 2016 13:37:22 UTC +00:00", participants: [{name: 'Peter Parker', status: 'confirmed', phone: '+4411223344', email: 'spiderman@dc-comics.com'}, {name: "Captain America", status: 'confirmed', phone: '+4411223344', email: 'captain@america.com'}, {name: "Captain Finland", status: 'confirmed', phone: '+4411223344', email: 'captain@finland.fi'}]}]}.to_json
end

post "/updatestatus" do
 puts 'moi'
 eka = "first"
end

