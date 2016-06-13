require 'sinatra/sequel'

# set :root, File.join(File.dirname(__FILE__), '..')

configure :development do
  require 'sqlite3'
  set :database, 'sqlite://tmp/development.sqlite3'
  set :storage_path, File.join(settings.root, 'tmp', 'storage')
end

configure :test do
  require 'sqlite3'
  set :database, 'sqlite::memory'
  set :storage_path, '/tmp/test_storage'
end

configure :production do
  require 'pg'
  u = ENV['POSTGRES_USER']
  pw = ENV['POSTGRES_PASSWORD']
  h = ENV['POSTGRES_PORT_5432_TCP_ADDR']
  p = ENV['POSTGRES_PORT_5432_TCP_PORT']
  db = 'document_vault'
  set :database, "postgres://#{u}:#{pw}@#{h}:#{p}/#{db}"
  set :storage_path, ENV['DOCUMENT_VAULT_PATH']
  # needed so that psql connections don't become stale with passenger
  database.extension(:connection_validator)
  database.pool.connection_validation_timeout = -1
end
