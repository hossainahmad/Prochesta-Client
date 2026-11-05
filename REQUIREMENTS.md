
# **Social Development Events Platform**

In this assignment, you'll build a community-driven event management platform where users can **create**, **join**, and **track** social service events in their local area.

Examples:

* Winter Clothes Distribution – Mirpur 10, Dhaka  
* Blanket Distribution for the Needy – Mohammadpur, Dhaka

---

## **Main Requirements**

### **Layout & Page Structure**

1. **Navbar:**  
   * App Logo/Name  
   * **Upcoming Events**  
   * **Conditional Login/Logout:**  
     * If not logged in, show a *Login* button.  
     * If logged in, show the user's profile picture and *Logout* button.  
     * On hovering over the profile picture, show the user's display name.  
   * **Profile Picture (Dropdown):**  
     * Create Event (**Private/Protected Route**)  
     * Manage Events (**Private/Protected Route**)  
     * Joined Events (**Private/Protected Route**)  
2. **Main Section:** Main Section will show different pages based on routes.  
3. **Footer:** A footer with all relevant information and an eye-catching design.

### **Authentication System**

1. **Login Page:** When you click the login button on the navbar it redirects to the login page. You have to use password and email-based authentication to log in. The login page will have:  
   1. Email  
   2. Password  
   3. Google login / GitHub — implement any one.  
   4. A link that will redirect to the Register page.  
2. **Register Page:** You have to use password and email-based authentication to register. The Register page will have:  
   1. Name  
   2. Email  
   3. photoURL  
   4. Password  
   5. A link that will redirect to the Login page.  
      * For password validation, you need to follow this: must have an uppercase letter, a lowercase letter, and a length of at least 6 characters.  
      * If any of these requirements isn't fulfilled, show an error message/toast.  
      * After successful login or registration, show a toast/SweetAlert.

💡Don’t implement email verification or the forget password method, as it will inconvenience the examiner. If you want, you can add these after receiving the assignment result.

### **Home Page (Public)**

* **Banner section:** Design it based on the social development and community-service theme.  
* **Feature section:** Showcase a few features of this application.  
* **Recent Upcoming Events Section:** Show 6 recent upcoming events(using **.limit()** operator of mongodb) based on date which you have added through Create Event Page. Which data you want to show is totally up to you. Show cards on 2 or 3 column grid layouts. **(Dynamic \- Get Data from database)**   
* **Gallery section:** Showcase photographs of different community service events (static).  
* **Newsletter section:** A newsletter subscription section. You have to design this section. No functionality is required for this section.

### **Create Event Page (Private Page)**

There will be a Create Event page to create an event.

**Create Event Functionalities:**

* Any logged-in user is able to create an event.  
* An event will have a title, description, event type (dropdown: Cleanup, Plantation, Donation, etc.), thumbnail Image URL, location, and event date. **Ensure that no past date can be added. The date must be in the future.**  
* You need to keep the user email with the event data of the person creating the event, so you can validate who created it.  
* A **success message** will be shown when the event is created successfully, and the user will be redirected to the Upcoming Events page.

### **Upcoming Events (Public Page)**

Show all events created by users using the Create Event form in a grid layout. Each individual event card will have the event thumbnail, title, location, event type, event date, and a View Event button. You can add more information if you want.

Keep in mind that this page will only show upcoming events. Events whose dates have passed must not appear on this page.

**View Event button functionality**

* By clicking the View Event button, the user will be navigated to the event details page where the user will see the event details. There will also be a **Join Event** button.  
* Users will be able to join an event by clicking the **Join Event** button, and it must be functional.  
* When a user joins an event, store the data in the database along with the event and user data.

**Keep in mind:** The event details page is not a private page. Users can see the details page without logging in. However, to join an event, the user must be logged in.

### **Joined Events Page (Private Page)**

This page will show all events joined by the logged-in user. Show events sorted by event date. 

### **Manage Events Page (Private Page)**

From this page, the user will be able to see all events created by them and update any event data. Also implement delete event functionality to delete an event.

**Keep in mind:** Users can only delete and update their own created event data.

### **UI Design Requirements**

* **Unique Design:** First, decide what kind of website you want to make. Then, search online or check out websites like ThemeForest to get ideas for the design. But remember, your website idea shouldn't be similar to any projects you've done before or to any examples in your modules or conceptual sessions.  
* You can also look for free resources on [blogs](https://bootcamp.uxdesign.cc/free-images-and-resources-collection-for-website-c77f2fc46ce5) to help with your website.  
1. Keep the main heading style (font, size, color) consistent across all sections.  
2. Keep paragraph spacing balanced and text easily readable.  
3. Maintain uniform image sizes and spacing.  
4. Use the same button style as on the home page.  
5. Ensure good spacing and proper alignment.  
6. Navbar: Keep the heading/logo the same style and size as on the home page.  
7. Use a grid layout with equal image sizes.  
8. Keep all cards equal height and width (especially in services, projects, or products sections).  
9. Use the new X logo instead of the old Twitter bird to match the latest rebrand.  
10. **Responsiveness:** Make it responsive for all devices, including mobile, tablet, and desktop views.

**Resources: You Can Get Design Ideas**

* [https\://uiverse.io/](https://uiverse.io/)  
* [https\://devmeetsdevs.com/](https://devmeetsdevs.com/)  
* [https\://bootcamp.uxdesign.cc/free-images-and-resources-collection-for-website-c77f2fc46ce5](https://bootcamp.uxdesign.cc/free-images-and-resources-collection-for-website-c77f2fc46ce5)  
* [https\://themeforest.net/](https://themeforest.net/)  
* [https\://codecanyon.net/](https://codecanyon.net/)

### **Challenge Requirement**

1. **Validation:**  
   * Add validation in the Create Event and Update Event forms.  
   * Add validation in all authentication-related forms.  
2. **Theme Customization:** Add a theme toggling button for changing themes from light to dark / dark to light. Changing the theme should make the full system dark/light based on user interaction.  
3. You must implement JWT validation to make APIs protected where needed.

### **Optional (Highly Recommended)**

Implement any two tasks from the following optional list:

1. Add proper loading skeletons where needed throughout the application.  
2. Implement a profile view and update profile feature. The user will be able to update their name and profile picture.  
3. Add one extra feature of your own. This will help you differentiate your project from others in the future.

---

## **Tech Stack**

**FrontEnd:**

* Next JS (App Router)  
* Hero UI / Daisy UI / ShadCn UI  
* TypeScript / JavaScript

**Authentication & Authorization:**

* BetterAuth  
* MongoDB Adapter  
* JWT

**Backend:**

* Express JS  
* MongoDB  
* TypeScript (if you have enough knowledge) / JavaScript