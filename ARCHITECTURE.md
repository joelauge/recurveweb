# RecourseLLM Architecture

This document provides a comprehensive overview of RecourseLLM's system architecture, including the core REPL-based approach, behavior tree orchestration, Zenoh integration, and model lifecycle management.

## Table of Contents

- [System Overview](#system-overview)
- [Core Architecture](#core-architecture)
- [Behavior Tree Orchestration](#behavior-tree-orchestration)
- [Zenoh Integration](#zenoh-integration)
- [Model Lifecycle Management](#model-lifecycle-management)
- [VSCode Extension Architecture](#vscode-extension-architecture)

## System Overview

RecourseLLM is a framework for building efficient agentic coding assistants that run entirely on local, open-source language models. It uses a **recursive, REPL-based architecture** to overcome context limitations of smaller models, enabling them to perform complex tasks that would otherwise require much larger cloud-based models.

### Key Architectural Principles

1. **REPL-Based Execution**: Treat large documents as an external environment to examine programmatically
2. **Behavior Tree Orchestration**: Robust, modular control flow with explicit state tracking
3. **Dual-Instance Optimization**: Task-optimized models for generation and analysis
4. **Zenoh Context Sync**: Real-time workspace context synchronization
5. **Model Lifecycle Management**: Automatic health monitoring and fault tolerance

## Core Architecture

### Dual-Instance Architecture (Default)

The dual-instance architecture uses two separate llama-server instances optimized for different tasks:

```
┌─────────────────────────────────────────────────────────┐
│                   RecourseLLM Proxy                      │
│              (OpenAI-compatible API)                    │
│                    Port 5001                            │
└─────────────────┬────────────────────┬──────────────────┘
                  │                    │
        ┌─────────▼─────────┐  ┌──────▼──────────────┐
        │  Root Instance    │  │ Recursive Instance  │
        │   (Port 9000)     │  │    (Port 9001)      │
        │                   │  │                     │
        │ RecourseLLM_Q8b   │  │ RecourseLLM_Q0.6b   │
        │ 1 slot            │  │ 3 slots             │
        │ 32K context       │  │ 4K context          │
        │                   │  │                     │
        │ Use: REPL code    │  │ Use: sub_RLM calls  │
        │      generation   │  │      fast analysis  │
        └───────────────────┘  └─────────────────────┘
```

**Benefits:**
- **Task-optimized models**: 8B for complex generation, 0.6B for fast analysis
- **Better VRAM efficiency**: ~8-10 GB total vs ~7 GB single instance
- **3-5x faster parallel processing**: Multiple recursive calls in parallel
- **Independent scaling**: Adjust each model's context and resources separately

### Component Stack

```
┌──────────────────────────────────────────────────────┐
│                    Client Layer                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │  VSCode    │  │ Open-WebUI │  │   cURL     │     │
│  │ Extension  │  │            │  │  / API     │     │
│  └────────────┘  └────────────┘  └────────────┘     │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│              RecourseLLM Proxy (Port 5001)            │
│  ┌────────────────────────────────────────────────┐  │
│  │  OpenAI-Compatible API Endpoint                │  │
│  │  - /v1/chat/completions                        │  │
│  │  - /v1/models                                  │  │
│  │  - /health                                     │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│           REPL Orchestration Layer                   │
│  ┌────────────────────────────────────────────────┐  │
│  │  Behavior Tree Engine                          │  │
│  │  - Task decomposition                          │  │
│  │  - Adaptive chunking                           │  │
│  │  - Parallel batch processing                   │  │
│  │  - Error handling & recovery                   │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │  SafeREPL Environment                          │  │
│  │  - Sandboxed Python execution                  │  │
│  │  - Network access (optional)                   │  │
│  │  - File system access                          │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│              Model Inference Layer                   │
│  ┌────────────────────────────────────────────────┐  │
│  │  llama-server (Port 9000/9001)                 │  │
│  │  - Multi-slot parallel inference               │  │
│  │  - GPU acceleration (CUDA)                     │  │
│  │  - Dynamic context management                  │  │
│  │  - Health monitoring                           │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│                 Context Layer                        │
│  ┌────────────────────────────────────────────────┐  │
│  │  Zenoh Distributed Context (Port 8000)         │  │
│  │  - Real-time workspace sync                    │  │
│  │  - Pub/sub messaging                           │  │
│  │  - Multi-client coordination                   │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

## Behavior Tree Orchestration

RecourseLLM uses **Behavior Trees (BTs)** for robust, modular orchestration of REPL execution and model lifecycle management.

### Why Behavior Trees?

Behavior Trees provide several advantages over traditional control flow:

1. **Explicit State Tracking**: Every node returns SUCCESS, FAILURE, or RUNNING
2. **Composability**: Complex behaviors built from simple, reusable nodes
3. **Visual Debugging**: Tree structure maps directly to execution flow
4. **Error Handling**: Built-in fallback and recovery patterns
5. **Modularity**: Easy to add, remove, or modify behaviors

### Core BT Nodes

**Control Flow Nodes:**
- **Sequence**: Execute children in order, fail on first failure
- **Selector**: Try children in order, succeed on first success
- **Parallel**: Execute multiple children concurrently
- **Decorator**: Modify child behavior (retry, invert, timeout)

**Action Nodes:**
- **GenerateCode**: Generate REPL code for document analysis
- **ExecuteCode**: Run code in SafeREPL environment
- **ProcessChunk**: Handle individual document chunks
- **CheckHealth**: Verify model instance health
- **RecoverModel**: Restart failed model instances

**Condition Nodes:**
- **CheckSlotAvailable**: Verify inference slot availability
- **CheckContextSize**: Validate context window usage
- **CheckModelHealth**: Test model responsiveness

### BT Web UI

RecourseLLM includes a powerful web-based UI for managing behavior trees:

**Features:**
- **Visual Editor**: Drag-and-drop tree construction
- **Code Editor**: Edit node Python code in-browser
- **Live Debugger**: Step through execution, inspect variables
- **System Flow**: Real-time architecture visualization
- **Node Library**: Browse and search available nodes

**Access**: `http://localhost:6001`

## Zenoh Integration

Zenoh provides real-time, distributed context synchronization across RecourseLLM components.

### Architecture

```
┌─────────────────────────────────────────────────────┐
│              Zenoh Router (Port 8000)               │
│         WebSocket + TCP Pub/Sub Messaging           │
└─────────────┬───────────────┬───────────────────────┘
              │               │
    ┌─────────▼────┐    ┌────▼──────────┐
    │  VSCode Ext  │    │  RecourseLLM   │
    │   (Client)   │    │    Proxy      │
    │              │    │   (Client)    │
    └──────────────┘    └───────────────┘
```

### Context Synchronization

The VSCode extension automatically synchronizes workspace context:

1. **On Workspace Open**:
   - Scan workspace for relevant files
   - Prioritize by importance (config, entry points, core modules)
   - Publish file list and content to Zenoh

2. **On File Change**:
   - Detect file modifications via file watcher
   - Publish updated content to Zenoh
   - Debounce rapid changes (1 second)

3. **On Context Request**:
   - RecourseLLM proxy subscribes to workspace topics
   - Receives real-time file updates
   - Uses context for code-aware responses

## Model Lifecycle Management

RecourseLLM includes robust model lifecycle management with automatic health monitoring and fault tolerance.

### Health Monitoring

**Continuous Health Checks:**
- Periodic `/health` endpoint polling (every 30 seconds)
- Inference slot availability monitoring
- Response time tracking
- GPU memory usage monitoring

**Health States:**
- **HEALTHY**: Model responding normally
- **DEGRADED**: Slow responses or high memory usage
- **UNHEALTHY**: Failed health checks or timeouts
- **CRASHED**: Process terminated unexpectedly

### Fault Tolerance

**Circuit Breaker Pattern:**
```python
if health_check_failures >= 3:
    circuit_state = OPEN
    stop_routing_requests()
    attempt_recovery()
```

**Recovery Strategies:**
1. **Soft Recovery**: Clear inference cache, reset slots
2. **Hard Recovery**: Restart llama-server process
3. **Failover**: Route to backup instance (dual-instance mode)

## VSCode Extension Architecture

The RecourseLLM VSCode extension provides seamless IDE integration with LSP-based architecture.

### Architecture

```
┌─────────────────────────────────────────────────────┐
│              VSCode Extension (Client)              │
│  ┌───────────────────────────────────────────────┐  │
│  │  Extension Host (TypeScript)                  │  │
│  │  - Command registration                       │  │
│  │  - Webview management                         │  │
│  │  - Context manager                            │  │
│  │  - Workspace scanner                          │  │
│  └─────────────────┬─────────────────────────────┘  │
│                    │                                 │
│  ┌─────────────────▼─────────────────────────────┐  │
│  │  LSP Client (vscode-languageclient)          │  │
│  │  - JSON-RPC communication                     │  │
│  │  - Request/response handling                  │  │
│  │  - Notification streaming                     │  │
│  └─────────────────┬─────────────────────────────┘  │
└────────────────────┼─────────────────────────────────┘
                     │ stdio
┌────────────────────▼─────────────────────────────────┐
│              LSP Server (Python)                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  pygls Language Server                        │  │
│  │  - Command handlers                           │  │
│  │  - Document sync                              │  │
│  │  - Diagnostics                                │  │
│  └─────────────────┬─────────────────────────────┘  │
│                    │                                 │
│  ┌─────────────────▼─────────────────────────────┐  │
│  │  Backend Client (OpenAI API)                  │  │
│  │  - HTTP requests to RecourseLLM proxy          │  │
│  │  - Streaming response handling                │  │
│  └─────────────────┬─────────────────────────────┘  │
│                    │                                 │
│  ┌─────────────────▼─────────────────────────────┐  │
│  │  Zenoh Client                                 │  │
│  │  - Workspace context publishing               │  │
│  │  - Real-time file sync                        │  │
│  └───────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Auto-Sync Modes

**Minimal Mode:**
- README + main entry point only
- ~2-5 files
- Fastest startup

**Smart Mode (Default):**
- Key files + recently modified
- Configuration files
- Core modules
- ~20-50 files

**Full Mode:**
- All tracked files within limits
- Respects maxFiles and maxSizeKB
- ~50-500 files

## Performance Characteristics

### Throughput

**Single Instance:**
- Root model: ~10-20 tokens/second
- Parallel slots: 3-4x throughput

**Dual Instance:**
- Root model: ~10-20 tokens/second
- Recursive model: ~50-100 tokens/second
- Combined: 5-10x throughput for complex tasks

### Resource Usage

**Memory:**
- 8B Q6_K model: ~6-7 GB VRAM
- 0.6B Q8_0 model: ~1-2 GB VRAM
- Dual instance total: ~8-10 GB VRAM

**CPU:**
- Minimal during GPU inference
- Higher during REPL execution
- Zenoh overhead: <1% CPU

## References

- [Behavior Trees in Robotics and AI](https://arxiv.org/abs/1709.00084)
- [llama.cpp Documentation](https://github.com/ggerganov/llama.cpp)
- [Zenoh Protocol Specification](https://zenoh.io/docs/)
- [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)
