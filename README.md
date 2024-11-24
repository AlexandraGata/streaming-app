This application was required as part of my thesis. The following explanation is part of the documentation describing the "System architecture":

As mentioned in the chapter “Tool and Technologies”, the application was created using the 
MERN stack. Additionally, there were two APIs included in the development. The Movie 
Database (TMDB) was used in order to get movie data. The PayPal API was used to integrate 
the subscription-based payment system. All these technologies interact with each other to 
achieve a consistent application that can deliver the service properly. 

Starting from the front end subsystem, there are multiple requests sent for different 
functionalities. The “store” component communicates with TMDB API in order to get all the 
movie details necessary. There are three GET requests that gather various data: the genres, the 
details for one movie and multiple movies from one particular genre. The other requests from 
the front end are sent either from hooks or context to the user controller in the back end. They 
have the role of managing authentication details, data for each user’s list of movies and their 
subscription status. 

The backend manages the data coming from the front end requests. It acts as an 
intermediary between the interface and the database, which in this case is MongoDB. By 
managing the user data, it is updated in the database when a user signs up, adds or removes a 
movie from their list, or when they modify their subscription, the status is properly updated. 
Moreover, the backend sends requests to the PayPal API in order for the users to be able to 
cancel their subscriptions. 

In summary, the front end sends requests to the TMDB to get movie data and to the 
backend to manage user-related functionalities. The backend is an intermediary that 
communicates with the database MongoDB and the PayPal API. 
