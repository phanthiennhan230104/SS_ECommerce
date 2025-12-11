📘 README.md Template – Software Architecture Project
# 🧩 Software Architecture Project
Group 6 Project

## 📁 Tech Stack

- **Backend**: Java Springboot  
- **Frontend**: Reactjs
- **Database**: MySQL
- **Caching**: Redis (Docker)

## 🏗️ Project Structure
<pre>
SS_Ecommerce/
 ├── backend/
 ├── frontend/
</pre>

## Run Backend
<pre>
    cd backend
    ./mvnw spring-boot:run 
</pre>

## Run Frontend
<pre>
    cd frontend
    npm install
    npm run dev 
</pre>

## Build and Run Redis Cache
<pre>
    docker run -d --name redis -p 6379:6379 redis
</pre>
 Step 1: brew install redis
    Step 2: brew --prefix redis
    Step 3: echo 'export PATH="/usr/local/opt/redis/bin:$PATH"' >> ~/.zshrc
            source ~/.zshrc
    Check Redis: redis-cli
## QA Caching cho Mac
<pre>
    Step 1: brew install redis
    Step 2: brew --prefix redis
    Step 3: echo 'export PATH="/usr/local/opt/redis/bin:$PATH"' >> ~/.zshrc
            source ~/.zshrc
    Check Redis: redis-cli
</pre>

## QA Caching cho Window
<pre>
    Step 1: Install WSL
    Run PowerShell (Run as Admin):
        wsl --install
    Restart
    Step 2: Install Redis in Ubuntu
        Open Ubuntu (WSL), Run:
        sudo apt update
        sudo apt install redis-server -y
    Run Redis:
        sudo service redis-server start
    Check Redis:
        redis-cli ping
</pre>
