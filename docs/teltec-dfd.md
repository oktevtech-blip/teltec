# Teltec System Data Flow Diagram

## System Overview
```mermaid
graph TD
    classDef frontend fill:#e1f5fe,stroke:#01579b
    classDef backend fill:#f3e5f5,stroke:#4a148c
    classDef database fill:#fff3e0,stroke:#e65100

    U[User/Admin]:::frontend
    FE[Frontend Web App]:::frontend
    BE[Backend Server]:::backend
    DB[(MySQL Database)]:::database

    U <--> FE
    FE <--> BE
    BE <--> DB
```

## Frontend Architecture
```mermaid
graph TD
    classDef component fill:#e3f2fd,stroke:#1565c0
    classDef context fill:#e8f5e9,stroke:#2e7d32
    
    subgraph Frontend Components
        UI[User Interface]:::component
        Auth[Authentication]:::component
        RC[React Components]:::component
        CTX[Context API]:::context
    end

    UI --> Auth
    Auth --> RC
    RC <--> CTX
```

## Page Structure
```mermaid
graph TD
    classDef page fill:#f3e5f5,stroke:#4a148c
    classDef component fill:#e3f2fd,stroke:#1565c0

    subgraph Pages
        MD[MainDashboard]:::page
        P[Projects]:::page
        I[Inventory]:::page
        M[Maintenance]:::page
        R[Reports]:::page
        C[Clients]:::page
    end

    subgraph Dashboard Components
        DL[DashboardLayout]:::component
        DO[DashboardOverview]:::component
        PC[ProjectsCard]:::component
        IC[InventoryCard]:::component
        MC[MaintenanceCard]:::component
        QA[QuickActions]:::component
    end

    MD --> DL
    DL --> DO
    DO --> PC
    DO --> IC
    DO --> MC
    DO --> QA
```

## State Management
```mermaid
graph TD
    classDef context fill:#e8f5e9,stroke:#2e7d32
    classDef form fill:#fff3e0,stroke:#e65100

    subgraph Context Management
        AC[AppContext]:::context
        AS[AppState]:::context
        AR[AppReducer]:::context
    end

    subgraph Forms
        PF[ProjectForm]:::form
        IF[InventoryForm]:::form
        CF[ClientForm]:::form
    end

    AC --> AS
    AS --> AR
    
    PF --> AC
    IF --> AC
    CF --> AC
```

## Backend Integration
```mermaid
graph TD
    classDef frontend fill:#e1f5fe,stroke:#01579b
    classDef backend fill:#f3e5f5,stroke:#4a148c
    classDef database fill:#fff3e0,stroke:#e65100

    CTX[Context API]:::frontend
    API[Express API]:::backend
    ENV[Environment Config]:::backend
    DB[(MySQL Database)]:::database

    CTX <--> API
    API <--> DB
    ENV --> API
```
```


1. System Overview Layer
The highest level shows the main system components:

User/Admin: End users who interact with the system
Frontend Web App: React-based web interface
Backend Server: Express.js server handling API requests
MySQL Database: Data persistence layer
2. Frontend Architecture Layer
Shows the core frontend components:

User Interface (UI): Visual components and layouts
Authentication: Handles user login/access control
React Components: Reusable UI building blocks
Context API: Global state management system
3. Page Structure Layer
Details the main application pages and their components:

Pages
MainDashboard: Primary landing page
Projects: Project management section
Inventory: Equipment tracking
Maintenance: System maintenance features
Reports: Data analysis views
Clients: Client management section
Dashboard Components
DashboardLayout: Main layout wrapper
DashboardOverview: Summary view
ProjectsCard: Project status display
InventoryCard: Inventory status
MaintenanceCard: Maintenance tasks
QuickActions: Common user actions
4. State Management Layer
Shows how data flows through the application:

Context Management
AppContext: Global state container
AppState: Current application state
AppReducer: State update logic
Forms
ProjectForm: Project data entry
InventoryForm: Inventory management
ClientForm: Client information
5. Backend Integration Layer
Demonstrates server-side connections:

Context API: Frontend state management
Express API: Backend request handling
Environment Config: System configuration
MySQL Database: Data storage
Color Coding
🔵 Frontend (light blue): User-facing components
🟣 Backend (purple): Server-side logic
🟡 Database (orange): Data storage
🟢 Context (green): State management
🔷 Components (blue): UI elements
Data Flow Patterns
User interactions trigger Context API actions
Context API communicates with Express backend
Backend processes requests and interacts with database
Data flows back through the same path to update UI