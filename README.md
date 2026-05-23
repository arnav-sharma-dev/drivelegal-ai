# DriveLegal-AI ⚖️🏍️

> **AI-Powered Traffic Law Parser & Statutory Compliance Appeal Assistant for Indian Motorists.**

DriveLegal-AI is a high-fidelity full-stack application designed to help Indian motorists parse traffic notices/challans, cross-reference infraction codes with the **Motor Vehicles Act, 1988 (2019 Amendment)** using an open-source Retrieval-Augmented Generation (RAG) pipeline, and instantly generate highly structured, legally cited markdown representations and appeals.

---

## 🏛️ Monorepo Architecture

DriveLegal-AI is designed with a modern, decoupled monorepo layout separating backend services from client applications:

```
drivelegal-ai/
├── backend/                  # FastAPI Web Server (Asynchronous Core)
│   ├── app/
│   │   ├── api/              # Route controller layers (FastAPI routing)
│   │   ├── core/             # Environment & global settings (Pydantic Settings)
│   │   ├── schemas/          # Data contract models (Pydantic validation schemas)
│   │   └── services/         # Async core services (OCR Parser, LangChain RAG, Appeal Drafter)
│   ├── requirements.txt      # Python dependencies (fastapi, uvicorn, langchain-core)
│   └── verify_backend.py     # Automated backend unit verifications
└── frontend/                 # Vite + React + TypeScript Dashboard
    ├── src/
    │   ├── components/       # Premium UI components (Uploader, Split views, Layouts)
    │   ├── services/         # Client services (API routing + Offline mockup fallbacks)
    │   ├── types/            # Strict TypeScript contract interfaces
    │   └── utils/            # Light, sandboxed markdown parser utilities
    ├── tailwind.config.js    # Custom styling parameters (Glow metrics, colors)
    └── package.json          # Node dependency configurations
```

---

## ✨ Features

- 📑 **Smart Challan Document Scanner**: Accept PDFs and image uploads (JPEG/PNG). Integrates regular-expression rules mimicking state-of-the-art OCR engines to scan dates, location markers, speed indexes, and Indian vehicle plates (e.g., `DL-3C-XX-9999`).
- 🤖 **LangChain RAG Integration**: Queries a localized knowledge base containing the Indian Motor Vehicles Act (MVA) utilizing LangChain's standard `BaseRetriever` objects. Accurately maps violations to **Section 183(1) (Speeding)**, **Section 184 (Dangerous Driving)**, **Section 185 (Drunken Driving)**, **Section 194D (Helmet Violation)**, or **Section 122 (Dangerous Parking)**.
- ✍️ **Asynchronous Appeal Composer**: Auto-generates customized written representations to RTOs or Superintendents of Traffic Police, incorporating standard procedural grounds:
  - **Calibration Errors**: Contest radar gun readings where mandatory annual validation certs are missing.
  - **Inadequate Signage**: Section 116 MVA challenges where statutory speed limit indicators are hidden or absent.
  - **Medical Emergencies**: Force Majeure defenses illustrating humanitarian urgency.
- 💻 **Premium Visual Experience**: Fully responsive, dark-mode dashboard styled with frosted-glass containers, interactive loaders, live markdown edit-preview toggle drawers, and checklist tracking.
- 🔌 **Smart Client Resilience**: Built-in api mockup triggers that seamlessly simulate full OCR/RAG workflows locally if the backend server is offline, facilitating quick frontend evaluations out-of-the-box.

---

## ⚡ Prerequisites

To launch the monorepo locally, ensure your computer has the following tools installed:

- **Python**: v3.10 or higher
- **Node.js**: v18.0 or higher
- **npm** or **Yarn**

---

## ⚙️ Quick Start Setup Guide

### Part 1: Python / FastAPI Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   - **On macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
   - **On Windows:**
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```

3. **Install the required packages:**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Verify import bindings and RAG processors (Optional):**
   ```bash
   python verify_backend.py
   ```

5. **Boot up the server:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   *The backend documentation will compile and become interactive immediately at:* [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Part 2: React / TypeScript Frontend Setup

1. **Open a new terminal session and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Launch the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application in your browser:**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚖️ Legal Disclaimer

*DriveLegal-AI is an open-source educational compliance tool designed to help Indian motorists review standard statutory structures under the Motor Vehicles Act, 1988. It does not constitute formal legal advice, and motorists are encouraged to consult certified legal counsel for court representing challan contestings.*

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.
