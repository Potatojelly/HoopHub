# HoopHub

The “Hoop Hub” is a social network platform particularly targeting basketball enthusiasts. As “Hoop Hub” is a social networking platform for people who are into basketball, the initial prototype focuses on implementing basic and standard features that are generally expected from social network services.
After providing basic features, it aims to offer services specialized for basketball fans, such as providing NBA game schedules and results and a chat search that helps users organize street basketball games easily and smoothly. 

## Table of Contents

1. [Screen Shots/Demo](#screenshot)
2. [System Description](#system-description) 
3. [Usage](#usage)
4. [Technology Stack](#tech-stack)
5. [Reflection](#reflection)

## Screenshots <a name="screenshot"></a>

Demo:https://youtu.be/3RpPk8TwV5o  
Website:https://www.hoophubapp.com

### User Authentication
![image](https://github.com/Potatojelly/Capstone-HoopHub/assets/108857524/479706f2-60ea-4d23-b661-5d9ff92104a8)
![image](https://github.com/Potatojelly/Capstone-HoopHub/assets/108857524/4234a23a-f7ad-48fa-af4a-eba6a87b9a34)
![image](https://github.com/Potatojelly/Capstone-HoopHub/assets/108857524/c2872f5b-f2cb-454b-a87d-ae4e6ab39d88)
![image](https://github.com/Potatojelly/Capstone-HoopHub/assets/108857524/c8b25ac2-b697-451a-97c4-bed5df5cc8ba)
![PasswordMsg](https://github.com/Potatojelly/HoopHub/assets/108857524/3d2977eb-f389-4374-8220-7dacc49df73b)


### Social Networking
![image](https://github.com/Potatojelly/Capstone-HoopHub/assets/108857524/6aed0cf2-22f2-462a-95e5-12e5ce86b5e5)
![image](https://github.com/Potatojelly/Capstone-HoopHub/assets/108857524/ab0d29ff-675d-49c1-af8c-fc359e33c1b5)
![image](https://github.com/Potatojelly/Capstone-HoopHub/assets/108857524/b870cc63-ead8-4a19-bf34-07c6b6ff131d)
![image](https://github.com/Potatojelly/Capstone-HoopHub/assets/108857524/f2fb0bea-8c35-477b-82b3-506cf045c16c)


### Forum
![image](https://github.com/Potatojelly/Capstone-HoopHub/assets/108857524/cdeda30e-6c8d-4cb8-b3a1-6d5dd38ca20b)
![image](https://github.com/Potatojelly/Capstone-HoopHub/assets/108857524/7747a5bb-a5fa-4989-8f11-a448807ea724)
![image](https://github.com/Potatojelly/Capstone-HoopHub/assets/108857524/9c7ec10e-19cb-42f1-a5bc-89458f0fb256)


### Chat
![image](https://github.com/Potatojelly/Capstone-HoopHub/assets/108857524/232b8011-1d96-4186-a942-101a524c871c)
![image](https://github.com/Potatojelly/Capstone-HoopHub/assets/108857524/8acdba72-aed7-451e-8cbb-0e871f214657)
![image](https://github.com/Potatojelly/Capstone-HoopHub/assets/108857524/3011cefd-9806-4c8a-a58a-7cc2f4a7e9fd)

## System Description <a name="system-description"></a>
* Front-End
  
  The client-side is hosted within the AWS cloud, utilizing EC2 container service. By leveraging AWS Routing, CloudFront, and Certificate Manager services, it ensures users connect to the client-server under the secure protocol HTTPS and secure the server by prohibiting access from unknown IP addresses.

* Back-End
  
  The ExpressJS framework adopts the MVC pattern efficiently. Controllers handle the CRUD operations interfacing with various databases. AWS S3 is leveraged for scalable and secure object storage, particularly multimedia content. The server stores the returned URLs of those resources from S3 for easy retrieval and reference.  

* Database Integration
  
  The project adopted a hybrid database architecture to optimize data storage and retrieval. RDBMS Postgres is used to manage data related to users and forums. This helps to prevent performance degradation and enhances the maintenance performance. Also, the NoSQL database, MongoDB, handles unstructured data by the real-time chat feature. The less strict schema structure allows dynamic and rapid changes in chat data. 

![image](https://github.com/Potatojelly/Capstone-HoopHub/assets/108857524/0918281c-7f07-424b-88ac-842746bade59)
![EDR](https://github.com/Potatojelly/HoopHub/assets/108857524/f6e59371-13a2-400f-9740-3d38afc6fda8)


## Usage <a name="usage"></a>

* User Authentication System: provides a secure login/logout mechanism with password retrieval and reset features.

* Profile Customization: allows users to customize their profiles with images and status messages.

* Community Forum: provides CRUD operations for the forum; users can create, read, update, and delete posts, comments, and replies 

* Real-Time Chat: offers real-time chat functionality, enabling users to connect individually or in groups.

* Networking and Community Building: enables users to expand their network by searching for other basketball enthusiasts and sending friend requests.

## Technology stack <a name="tech-stack"></a>
The Hoop Hub project is built using the following technologies:

* Frontend: React, JS, Post CSS,  AWS CloudFront, AWS Route 53
  
* Backend: NodeJS, Express, Postgres DB, MongoDB, docker, AWS S3, AWS CloudFront, AWS Route 53
  
* Debugging Tools: React Developer Tools extension
  
* Additional Libraries/Modules: React Query, React Router, socket.io, Quill, bcrypt, cookie-parser, cors, morgan, etc.

## Reflection <a name="reflection"></a>

### Context for the Project

Despite the presence of well-known social network services in the market, there remains an unmet need for basketball enthusiasts. These existing platforms primarily focused on catering to a general audience, overlooking their specific interests and advanced needs. 

### Objective

Offer a comprehensive service(social networking, forum, chat, and basketball-related information) where users can access all functionalities they need in one integrated platform. 

### Challenges and Learning Experiences

* Implementation of uploading multimedia content  

While I was developing the feature of uploading multimedia content, I was indecisive about when multimedia content should be uploaded to AWS S3: when a user clicks the post button or when a user uploads them from their computer. I searched the method to handle uploading multimedia content logic and found out most people handle it by uploading multimedia content as soon as clients upload it. However, I thought it was a method that wastes costs because it requires deleting the multimedia content when clients cancel anyway. Because of this, I choose to upload them when a user clicks the post button. However, it caused a problem later that led to a bad User experience, which required clients to wait the whole time the server took to upload them to AWS S3 and return the data when the uploaded file size was huge. I solved the problem by building my logic to upload multimedia content, but it was not as successful as I expected in the end. 
 
* Implementation of real-time chat logic  

I had some challenges in figuring out how to distribute the messages to all the users that belong to particular chat rooms where the messages are generated even when they are not participating in the chat rooms in real-time. Since I was so obsessed with the idea that I needed to connect with users when they chose at least one chat room and I needed to use the socket.io library function that helps to track separate chat rooms, I spent lots of time on this problem, which I realized was so simple to solve in the end.
I could solve this problem by connecting all users to the server in real-time when they connect to the chat service page. By doing so,  the server is able to spread the message only to users who belong to the chat room where the message was generated. 

* Figuring out an efficient query to fetch data in the needed format  

It was hard to figure out the right and efficient query to fetch data in the format I wanted. Even I failed to find a good solution from Stackoverflow and chatGPT. I ended up reviewing the query grammar and eventually succeeded in fetching data in the format I wanted.

