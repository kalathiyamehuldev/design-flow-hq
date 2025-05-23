
import React, { useState, useEffect } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { GlassCard } from "@/components/ui/glass-card";
import { MotionButton } from "@/components/ui/motion-button";
import { cn } from "@/lib/utils";
import { 
  Check, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown, 
  Clock 
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { 
  selectAllTodos, 
  selectActiveTodos, 
  selectCompletedTodos, 
  getTodos, 
  addTodo, 
  updateTodo, 
  deleteTodo, 
  toggleTodo 
} from "@/redux/slices/todoSlice";

// Mock projects for selection
const projects = [
  "Modern Loft Redesign",
  "Coastal Vacation Home",
  "Corporate Office Revamp",
  "Luxury Apartment Redesign",
  "Restaurant Interior",
  "Boutique Hotel Lobby"
];

const TodoList = () => {
  const dispatch = useAppDispatch();
  const activeTodos = useAppSelector(selectActiveTodos);
  const completedTodos = useAppSelector(selectCompletedTodos);
  
  const [showCompleted, setShowCompleted] = useState(true);
  const [newTodoText, setNewTodoText] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [editTodoId, setEditTodoId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);
  
  // Filter completed/uncompleted todos
  const displayedTodos = [...activeTodos, ...(showCompleted ? completedTodos : [])];
  
  const handleAddTodo = () => {
    if (newTodoText.trim() === "") return;
    
    dispatch(addTodo({
      text: newTodoText,
      project: selectedProject || "Unassigned",
      dueDate: "No due date"
    }));
    
    setNewTodoText("");
    setSelectedProject("");
  };
  
  const handleToggleTodo = (id: string) => {
    dispatch(toggleTodo(id));
  };
  
  const handleDeleteTodo = (id: string) => {
    dispatch(deleteTodo(id));
  };
  
  const startEdit = (todoId: string, text: string) => {
    setEditTodoId(todoId);
    setEditText(text);
  };
  
  const saveEdit = () => {
    if (editText.trim() === "" || !editTodoId) return;
    
    dispatch(updateTodo({
      id: editTodoId,
      todo: { text: editText }
    }));
    
    setEditTodoId(null);
    setEditText("");
  };
  
  const cancelEdit = () => {
    setEditTodoId(null);
    setEditText("");
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-light mb-2">To-Do List</h1>
            <p className="text-muted-foreground">Keep track of your design tasks</p>
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                checked={showCompleted}
                onChange={() => setShowCompleted(!showCompleted)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              Show completed
            </label>
          </div>
        </div>

        {/* Add Todo Form */}
        <GlassCard className="p-4 animate-scale-in">
          <div className="flex flex-col space-y-3">
            <div className="flex space-x-3">
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
              />
              
              <MotionButton 
                variant="default"
                onClick={handleAddTodo}
                disabled={newTodoText.trim() === ""}
                motion="subtle"
              >
                <Plus size={18} />
              </MotionButton>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select 
                  className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none pr-8"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">Select project</option>
                  {projects.map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
              </div>
              
              <button className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm hover:bg-secondary flex items-center gap-1">
                <Clock size={14} />
                <span>Set due date</span>
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Todo List */}
        <div className="space-y-3 animate-fade-in animation-delay-[0.1s]">
          {displayedTodos.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <div className="text-2xl mb-2">✓</div>
              <h3 className="text-lg font-medium mb-1">All done!</h3>
              <p className="text-muted-foreground">Your to-do list is empty. Add some tasks to get started.</p>
            </GlassCard>
          ) : (
            displayedTodos.map(todo => (
              <GlassCard 
                key={todo.id} 
                className={cn(
                  "p-4 transition-all", 
                  todo.completed && "opacity-60"
                )}
              >
                {editTodoId === todo.id ? (
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      autoFocus
                      className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                    />
                    <MotionButton 
                      variant="default"
                      onClick={saveEdit}
                      disabled={editText.trim() === ""}
                      motion="subtle"
                    >
                      Save
                    </MotionButton>
                    <MotionButton 
                      variant="ghost"
                      onClick={cancelEdit}
                      motion="subtle"
                    >
                      Cancel
                    </MotionButton>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleTodo(todo.id)}
                        className={cn(
                          "flex-shrink-0 w-5 h-5 rounded-full border transition-colors mt-1",
                          todo.completed 
                            ? "bg-primary border-primary text-white flex items-center justify-center" 
                            : "border-gray-300 hover:border-primary"
                        )}
                      >
                        {todo.completed && <Check size={12} />}
                      </button>
                      
                      <div className="space-y-1">
                        <p className={cn(
                          "text-sm",
                          todo.completed && "line-through text-muted-foreground"
                        )}>
                          {todo.text}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 text-xs">
                          {todo.project && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                              {todo.project}
                            </span>
                          )}
                          
                          {todo.dueDate && (
                            <span className={cn(
                              "px-2 py-0.5 rounded-full",
                              todo.dueDate === "Today" && "bg-amber-100 text-amber-600",
                              todo.dueDate === "Tomorrow" && "bg-blue-100 text-blue-600",
                              todo.dueDate.includes("ago") && "bg-red-100 text-red-600",
                              (!todo.dueDate.includes("Today") && 
                               !todo.dueDate.includes("Tomorrow") && 
                               !todo.dueDate.includes("ago")) && "bg-gray-100 text-gray-600"
                            )}>
                              <Clock size={10} className="inline-block mr-1" /> {todo.dueDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => startEdit(todo.id, todo.text)}
                        className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-secondary"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="text-muted-foreground hover:text-red-500 p-1 rounded-md hover:bg-secondary"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </GlassCard>
            ))
          )}
          
          {activeTodos.length > 0 && (
            <div className="text-sm text-muted-foreground mt-2 pl-2">
              {activeTodos.length} {activeTodos.length === 1 ? 'task' : 'tasks'} remaining
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default TodoList;
