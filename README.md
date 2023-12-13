# UXV Stock Receiving WebApp x KEA

### [Link to page](https://uxvstocksystem.azurewebsites.net/)

### [Link to backend repository](https://github.com/Kemixd3/NoteManagerAPI)

## Installations guide

## Getting Started - Frontend Setup

1. **Installation of Dependencies**:
   ```bash
   git clone <repository-url>
   cd ViteApp
   npm install
   ```

### Configuration of Environment Variables

- Create a `.env` file at the root of your project.
- Set the following environment variables:
  VITE_CLIENT_ID=<Your_Google_OAuth2_Client_ID>
  VITE_LOCALHOST=<Your_Express_API_Localhost_URL>

Replace `<our_Google_OAuth2_Client_ID>` with your OAuth client ID and `<Your_Express_API_Localhost_URL>` with your local development server URL.

## Scripts to run the App

- **Development**: "npm run dev" or npm run vite
- **Start**: "npm start" or vite
- **Build**: "npm run build" or vite build
- **Linting**: "npm run lint"

### Database Setup (if applicable)

The application uses a MySQL database and relies on the following tables:

- `batches`
- `batches_has_received_goods_items`
- `material`
- `purchase_order`
- `purchase_order_items`
- `received_goods`
- `received_goods_items`
- `users`

For testing purposes, we have provided a backup download of the database with test data from [this link](your-database-backup-link-here). Import this database backup into your MySQL server to have the necessary tables and sample data for your local setup or hosted instance.

Ensure the database connection details in your application match the configuration of your local MySQL server to interact with the database.

### Deployment

To deploy the application to different environments (development, staging, production) on Azure Web App, follow the steps below:

#### 1. Initial Setup

- Ensure that the necessary environment variables defined in your `.env` file are set in the Azure environment under connection strings.
- Configure your Azure Web App settings to include the required connection strings for your application.

#### 2. Deployment Process

- Access the Azure portal and navigate to your Web App resource.
- Select the deployment method that suits your workflow, such as GitHub Actions, Azure Pipelines, or manual deployment via the Azure portal.

#### 3. Deployment Command

For the application to function correctly on Azure Web App, it's crucial to start the application using the following command:

```bash
pm2 serve /home/site/wwwroot/dist --no-daemon --spa
```

This command is used to serve the application through PM2 on Azure Web App, ensuring the correct handling of SPA (Single Page Application) routing.

## Application Details

- **Name**: UXVStockReceiving
- **Version**: 0.1.0
- **Frontend Dependencies**: @emotion/react, @emotion/styled, @mui/material, @react-oauth/google, @reduxjs/toolkit, axios, bootstrap, dhtmlx-gantt, jsonwebtoken, jwt-decode, react, react-bootstrap, react-bootstrap-icons, react-dom, react-hook-form, react-router-dom, react-scripts, sass
- **Development Dependencies**: @babel/plugin-proposal-private-property-in-object, @types/react, @types/react-dom, @vitejs/plugin-react, @vitejs/plugin-react-swc, eslint, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-react-refresh, vite, vite-plugin-html

### Project Structure (File structure)

The project follows a typical structure for a React application, organized into several main directories:

- **components:** This directory mostly contains reusable UI components used in the application. Some of these components are modular and often encapsulate specific functionalities or UI elements, promoting reusability and maintainability like toggle.jsx.

- **Context:** This directory includes context providers or hooks used for state management or sharing data across components. Contexts help in managing global state, enabling components to access shared data without passing props explicitly.

- **Controller:** The Controller directory contains utility functions, API handlers, and logic responsible for managing data flow between the frontend and backend. It helps in abstracting business logic from the UI components.

- **pages:** The pages directory holds higher-level components or views that represent distinct pages or routes in the application. Each page consists sometimes of multiple components and defines the layout or structure of a specific URL route.

- **store:** The store directory in the application currently holds functions related to theme and const custom css.

### Files

- **App:** The `App.js` (or `App.jsx`) file serves as the entry point to the application. It handles authentication before you can access AuthenticatedView.jsx, routing and global components like headers or footers that manages the overall layout or structure of the app.

- **index:** The `index.js` (or `index.jsx`) file initializes the React application, rendering the root component into the DOM.

- **router:** The `router.jsx` file manages application routing, using React Router to define routes and map them to specific components.

### Styling file structure

The root of the applications contains a global App.scss but the individual .jsx pages and components are likely to have their own styling also.
Example: `Nav.jsx` own styling would be named `Nav.css` and be located in the same directory.

### Structure Overview

The folder structure aims for decent modularity and separation of concerns, promoting a bit separation between UI components, state management, data handling, and page layouts. This helps a bit with scalability, maintainability, and code readability by providing a somewhat clear structure for various aspects of the application. Adjustments or additional folders might be present based on specific project requirements or architectural choices.

### Acknowledgments

The development of this project has been facilitated by various third-party libraries and resources:

- **[@emotion/react](https://emotion.sh/docs/introduction):** A library for writing CSS styles with JavaScript.
- **[@emotion/styled](https://emotion.sh/docs/introduction):** A CSS-in-JS library for styling React components.

- **[@mui/material](https://mui.com/):** A React UI framework that implements Google's Material Design. Used to create a table inside `oversigt.jsx`

- **[@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google):** A library for implementing Google OAuth authentication in React applications.

- **[Axios](https://axios-http.com/):** A promise-based HTTP client for making HTTP requests in the browser and Node.js.

- **[Bootstrap](https://getbootstrap.com/):** A popular CSS framework for building responsive and mobile-first websites.

- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken):** A library for creating and verifying JSON Web Tokens (JWTs).

- **[React Bootstrap](https://react-bootstrap.github.io/):** Bootstrap components built with React.

- **[React Router DOM](https://reactrouter.com/web/guides/quick-start):** A routing library for React applications.

- **[React Scripts](https://www.npmjs.com/package/react-scripts):** A set of scripts and tools for creating React applications.

- **[Sass](https://sass-lang.com/):** A CSS extension language that helps with writing maintainable and scalable CSS code.

- **[Stream](https://www.npmjs.com/package/stream):** A readable stream implementation for Node.js.

- **[util](https://www.npmjs.com/package/util):** A Node.js core utility library for commonly used functions.

These libraries have played a crucial role in enabling various functionalities and enhancing the development experience of this project.

### By Nikolai Berthelsen and Silas Sandager
