cd ./Ballkin_Backend
echo "Starting Backend..."
start npx nodemon server.ts 
cd ..
cd ./Ballkin_Client
echo "Starting Client..."
npm install   
ng serve