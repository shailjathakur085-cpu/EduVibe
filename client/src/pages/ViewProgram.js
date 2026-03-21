import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRegCopy, FaCheck, FaEdit, FaSave, } from 'react-icons/fa';
import './ViewProgram.css';

const ViewProgram = () => {
  const { lang, id } = useParams();
  const navigate = useNavigate();
  
  // States
  const [program, setProgram] = useState(null);
  const [showOutput, setShowOutput] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- NEW: Editing States for Notes ---
  const [isEditing, setIsEditing] = useState(false);
  const [editableCode, setEditableCode] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // --- FIRST: Try to fetch from database (for admin-added programs) ---
    const fetchFromDatabase = async () => {
      try {
        // Check if the ID looks like a MongoDB ObjectId (24 characters, alphanumeric)
        if (id.length === 24 && /^[a-fA-F0-9]{24}$/.test(id)) {
          const res = await fetch(`http://localhost:8081/api/programs/view/${id}`);
          if (res.ok) {
            const dbProgram = await res.json();
            setProgram(dbProgram);
            setEditableCode(dbProgram.code);
            return; // Found in database, don't check static data
          }
        }
      } catch (error) {
        console.log("Database fetch failed, trying static data...");
      }

      // --- FALLBACK: Check static data (for built-in programs) ---
      const programDatabase = {
        "c": {
          "1": { title: "Sum of all numbers using loop", code: `#include <stdio.h>\nint main() {\n    int n = 5, sum = 0;\n    for(int i=1; i<=n; i++) sum += i;\n    printf("Sum = %d", sum);\n    return 0;\n}`, output: "Sum = 15" },
          "2": { title: "Factorial of a number", code: `#include <stdio.h>\nint main() {\n    int n = 5, f = 1;\n    for(int i=1; i<=n; i++) f *= i;\n    printf("Factorial = %d", f);\n    return 0;\n}`, output: "Factorial = 120" },
          "3": { title: "Fibonacci series", code: `#include <stdio.h>\nint main() {\n    int n=5, a=0, b=1, next;\n    for(int i=0; i<n; i++) {\n        printf("%d ", a);\n        next = a+b; a=b; b=next;\n    }\n    return 0;\n}`, output: "0 1 1 2 3" },
          "4": { title: "Reverse a number", code: `#include <stdio.h>\nint main() {\n    int n=123, r=0;\n    while(n!=0) { r=r*10 + n%10; n/=10; }\n    printf("Reverse = %d", r);\n    return 0;\n}`, output: "Reverse = 321" },
          "5": { title: "Check if a number is prime", code: `#include <stdio.h>\nint main() {\n    int n=7, flag=0;\n    for(int i=2; i<=n/2; i++) if(n%i==0) flag=1;\n    if(flag==0) printf("Prime"); else printf("Not Prime");\n    return 0;\n}`, output: "Prime" },
          "6": { title: "Check Palindrome Number", code: `#include <stdio.h>\nint main() {\n    int n=121, r=0, t=n;\n    while(n>0) { r=r*10 + n%10; n/=10; }\n    if(t==r) printf("Palindrome"); else printf("Not");\n    return 0;\n}`, output: "Palindrome" },
          "7": { title: "Find largest among 3 numbers", code: `#include <stdio.h>\nint main() {\n    int a=10, b=20, c=15;\n    if(a>=b && a>=c) printf("%d", a);\n    else if(b>=a && b>=c) printf("%d", b);\n    else printf("%d", c);\n    return 0;\n}`, output: "20" },
          "8": { title: "Armstrong number check", code: `#include <stdio.h>\nint main() {\n    int n=153, s=0, t=n, r;\n    while(n>0) { r=n%10; s=s+(r*r*r); n/=10; }\n    if(t==s) printf("Armstrong"); else printf("Not");\n    return 0;\n}`, output: "Armstrong" },
          "9": { title: "Swap two numbers without third variable", code: `#include <stdio.h>\nint main() {\n    int a=10, b=20;\n    a=a+b; b=a-b; a=a-b;\n    printf("a=%d b=%d", a, b);\n    return 0;\n}`, output: "a=20 b=10" },
          "10": { title: "Matrix Multiplication", code: `// Matrix Multiplication code here\n#include <stdio.h>\nint main() { printf("Matrix multiplication result..."); return 0; }`, output: "Matrix multiplication result..." },
          "11": { title: "Linear Search in Array", code: `#include <stdio.h>\nint main() {\n    int arr[]={1,2,3,4,5}, k=3, f=0;\n    for(int i=0; i<5; i++) if(arr[i]==k) f=1;\n    if(f==1) printf("Found"); else printf("Not Found");\n    return 0;\n}`, output: "Found" }
        },
        "cpp": {
          "1": { title: "Hello World Program", code: `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello C++";\n    return 0;\n}`, output: "Hello C++" },
          "2": { title: "Addition of two numbers (OOPs)", code: `#include <iostream>\nusing namespace std;\nclass Add { public: int sum(int a, int b) { return a+b; } };\nint main() { Add obj; cout << obj.sum(10, 20); return 0; }`, output: "30" },
          "3": { title: "Class and Object Example", code: `#include <iostream>\nusing namespace std;\nclass Student { public: string name="BCA"; };\nint main() { Student s; cout << s.name; return 0; }`, output: "BCA" },
          "4": { title: "Function Overloading", code: `#include <iostream>\nusing namespace std;\nvoid d(int i) { cout << i; }\nvoid d(double f) { cout << f; }\nint main() { d(5); return 0; }`, output: "5" },
          "5": { title: "Inheritance Example", code: `#include <iostream>\nusing namespace std;\nclass A { public: void show() { cout << "Base"; } };\nclass B : public A {};\nint main() { B obj; obj.show(); return 0; }`, output: "Base" },
          "6": { title: "Virtual Functions", code: `#include <iostream>\nusing namespace std;\nclass A { public: virtual void s() { cout << "A"; } };\nclass B : public A { public: void s() { cout << "B"; } };\nint main() { A* p; B obj; p=&obj; p->s(); return 0; }`, output: "B" },
          "7": { title: "File Handling in C++", code: `#include <iostream>\n#include <fstream>\nusing namespace std;\nint main() { cout << "File Operation Successful"; return 0; }`, output: "File Operation Successful" }
        },
        "java": {
          "1": { title: "Hello World Program", code: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Java");\n    }\n}`, output: "Hello Java" },
          "2": { title: "Taking Input using Scanner", code: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.print("Enter value: ");\n        int n = 10; // Simulated input\n        System.out.println("Value is: " + n);\n    }\n}`, output: "Enter value: \nValue is: 10" },
          "3": { title: "Method Overriding", code: `class Parent {\n    void show() { System.out.println("Parent"); }\n}\nclass Child extends Parent {\n    @Override\n    void show() { System.out.println("Child"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Parent obj = new Child(); obj.show();\n    }\n}`, output: "Child" },
          "4": { title: "Abstract Class Example", code: `abstract class Shape {\n    abstract void draw();\n}\nclass Circle extends Shape {\n    void draw() { System.out.println("Drawing Circle"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Shape s = new Circle(); s.draw();\n    }\n}`, output: "Drawing Circle" },
          "5": { title: "Interface Implementation", code: `interface Animal {\n    void sound();\n}\nclass Dog implements Animal {\n    public void sound() { System.out.println("Bark"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Dog d = new Dog(); d.sound();\n    }\n}`, output: "Bark" },
          "6": { title: "Custom Exception Handling", code: `public class Main {\n    public static void main(String[] args) {\n        try {\n            int res = 10/0;\n        } catch(ArithmeticException e) {\n            System.out.println("Cannot divide by zero");\n        }\n    }\n}`, output: "Cannot divide by zero" },
          "7": { title: "ArrayList and LinkedList", code: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> list = new ArrayList<>();\n        list.add("Java");\n        System.out.println(list);\n    }\n}`, output: "[Java]" },
          "8": { title: "HashMap Operations", code: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        HashMap<Integer, String> map = new HashMap<>();\n        map.put(1, "BCA");\n        System.out.println(map);\n    }\n}`, output: "{1=BCA}" },
          "9": { title: "String Manipulation", code: `public class Main {\n    public static void main(String[] args) {\n        String str = "Study";\n        System.out.println(str.toUpperCase());\n    }\n}`, output: "STUDY" },
          "10": { title: "Java JDBC Connection", code: `// JDBC Simulated Connection\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Database Connected Successfully");\n    }\n}`, output: "Database Connected Successfully" }
        },
        "python": {
          "1": { title: "Hello World Program", code: `print("Hello, World!")`, output: "Hello, World!" },
          "2": { title: "Sum of Two Numbers", code: `# Sum of two numbers\nnum1 = 10\nnum2 = 20\nsum = num1 + num2\nprint("Sum:", sum)`, output: "Sum: 30" },
          "3": { title: "Check if a number is prime", code: `def is_prime(n):\n    if n <= 1:\n        return False\n    for i in range(2, n//2 + 1):\n        if n % i == 0:\n            return False\n    return True\n\nnum = 7\nif is_prime(num):\n    print(f"{num} is a prime number")\nelse:\n    print(f"{num} is not a prime number")`, output: "7 is a prime number" },
          "4": { title: "Factorial of a number", code: `def factorial(n):\n    if n == 0 or n == 1:\n        return 1\n    else:\n        return n * factorial(n-1)\n\nnum = 5\nprint(f"Factorial of {num} is {factorial(num)}")`, output: "Factorial of 5 is 120" },
          "5": { title: "Fibonacci Series", code: `def fibonacci(n):\n    a, b = 0, 1\n    for i in range(n):\n        print(a, end=" ")\n        a, b = b, a + b\n    print()\n\nfibonacci(10)`, output: "0 1 1 2 3 5 8 13 21 34 " },
          "6": { title: "Reverse a String", code: `def reverse_string(s):\n    return s[::-1]\n\noriginal = "Hello World"\nreversed_str = reverse_string(original)\nprint(f"Original: {original}")\nprint(f"Reversed: {reversed_str}")`, output: "Original: Hello World\nReversed: dlroW olleH" },
          "7": { title: "Check Palindrome", code: `def is_palindrome(s):\n    s = s.lower().replace(" ", "")\n    return s == s[::-1]\n\nword = "racecar"\nif is_palindrome(word):\n    print(f"'{word}' is a palindrome")\nelse:\n    print(f"'{word}' is not a palindrome")`, output: "'racecar' is a palindrome" },
          "8": { title: "List Operations", code: `# List operations\nnumbers = [1, 2, 3, 4, 5]\nprint("Original list:", numbers)\n\n# Add element\nnumbers.append(6)\nprint("After append:", numbers)\n\n# Remove element\nnumbers.remove(3)\nprint("After remove:", numbers)\n\n# Sort list\nnumbers.sort()\nprint("After sort:", numbers)`, output: "Original list: [1, 2, 3, 4, 5]\nAfter append: [1, 2, 3, 4, 5, 6]\nAfter remove: [1, 2, 4, 5, 6]\nAfter sort: [1, 2, 4, 5, 6]" },
          "9": { title: "Dictionary Operations", code: `# Dictionary operations\nstudent = {\n    "name": "John",\n    "age": 20,\n    "grade": "A"\n}\n\nprint("Student info:", student)\nprint("Name:", student["name"])\n\n# Add new key\nstudent["city"] = "New York"\nprint("Updated info:", student)\n\n# Remove key\ndel student["age"]\nprint("After removing age:", student)`, output: "Student info: {'name': 'John', 'age': 20, 'grade': 'A'}\nName: John\nUpdated info: {'name': 'John', 'age': 20, 'grade': 'A', 'city': 'New York'}\nAfter removing age: {'name': 'John', 'grade': 'A', 'city': 'New York'}" },
          "10": { title: "File Handling", code: `# Writing to a file\nwith open("example.txt", "w") as file:\n    file.write("Hello, Python!\n")\n    file.write("This is a file example.")\n\n# Reading from a file\nwith open("example.txt", "r") as file:\n    content = file.read()\n    print("File content:")\n    print(content)`, output: "File content:\nHello, Python!\nThis is a file example." },
          "11": { title: "Exception Handling", code: `try:\n    num = int(input("Enter a number: "))\n    result = 100 / num\n    print(f"Result: {result}")\nexcept ZeroDivisionError:\n    print("Error: Cannot divide by zero!")\nexcept ValueError:\n    print("Error: Please enter a valid number!")\nexcept Exception as e:\n    print(f"An error occurred: {e}")\nfinally:\n    print("Program completed.")`, output: "Enter a number: 5\nResult: 20.0\nProgram completed." },
          "12": { title: "Class and Object", code: `class Student:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def display_info(self):\n        print(f"Name: {self.name}, Age: {self.age}")\n    \n    def study(self):\n        print(f"{self.name} is studying")\n\n# Create objects\nstudent1 = Student("Alice", 20)\nstudent2 = Student("Bob", 21)\n\n# Use methods\nstudent1.display_info()\nstudent1.study()\nstudent2.display_info()\nstudent2.study()`, output: "Name: Alice, Age: 20\nAlice is studying\nName: Bob, Age: 21\nBob is studying" }
        },
        "dsa": {
          "1": { title: "Linear Search Algorithm", code: `#include <iostream>\nusing namespace std;\n\nint linearSearch(int arr[], int n, int x) {\n    for (int i = 0; i < n; i++)\n        if (arr[i] == x) return i;\n    return -1;\n}\n\nint main() {\n    int arr[] = {10, 20, 30, 40, 50};\n    int x = 30;\n    int res = linearSearch(arr, 5, x);\n    (res == -1) ? cout << "Not Found" : cout << "Element found at index: " << res;\n    return 0;\n}`, output: "Element found at index: 2" },
          "2": { title: "Binary Search (Recursive)", code: `#include <iostream>\nusing namespace std;\n\nint binarySearch(int arr[], int l, int r, int x) {\n    if (r >= l) {\n        int mid = l + (r - l) / 2;\n        if (arr[mid] == x) return mid;\n        if (arr[mid] > x) return binarySearch(arr, l, mid - 1, x);\n        return binarySearch(arr, mid + 1, r, x);\n    }\n    return -1;\n}\n\nint main() {\n    int arr[] = {2, 3, 4, 10, 40};\n    int res = binarySearch(arr, 0, 4, 10);\n    (res == -1) ? cout << "Not Found" : cout << "Index: " << res;\n    return 0;\n}`, output: "Index: 3" },
          "3": { title: "Bubble Sort Implementation", code: `#include <iostream>\nusing namespace std;\n\nvoid bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++)\n        for (int j = 0; j < n-i-1; j++)\n            if (arr[j] > arr[j+1]) swap(arr[j], arr[j+1]);\n}\n\nint main() {\n    int arr[] = {64, 34, 25, 12, 22};\n    bubbleSort(arr, 5);\n    cout << "Sorted array: 12 22 25 34 64";\n    return 0;\n}`, output: "Sorted array: 12 22 25 34 64" },
          "4": { title: "Insertion Sort", code: `// Insertion Sort Logic\nvoid insertionSort(int arr[], int n) {\n    int i, key, j;\n    for (i = 1; i < n; i++) {\n        key = arr[i]; j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j]; j = j - 1;\n        }\n        arr[j + 1] = key;\n    }\n}`, output: "Array Sorted using Insertion Sort" },
          "5": { title: "Selection Sort", code: `// Selection Sort Logic\nvoid selectionSort(int arr[], int n) {\n    int i, j, min_idx;\n    for (i = 0; i < n-1; i++) {\n        min_idx = i;\n        for (j = i+1; j < n; j++)\n          if (arr[j] < arr[min_idx]) min_idx = j;\n        swap(arr[min_idx], arr[i]);\n    }\n}`, output: "Array Sorted using Selection Sort" },
          "6": { title: "Stack using Linked List", code: `// Stack implementation using Linked List\nstruct Node {\n    int data; struct Node* link;\n};\nstruct Node* top;\nvoid push(int data) {\n    struct Node* temp = new Node();\n    temp->data = data; temp->link = top; top = temp;\n}`, output: "Stack Push/Pop Operations Successful" },
          "7": { title: "Queue using Array", code: `// Queue implementation using Array\n#define MAX 100\nclass Queue {\n    int front, rear, arr[MAX];\npublic:\n    Queue() { front = -1; rear = -1; }\n    void enqueue(int x) { arr[++rear] = x; }\n};`, output: "Queue Enqueue/Dequeue Ready" },
          "8": { title: "Inorder Traversal of Binary Tree", code: `// Binary Tree Inorder Traversal (Left, Root, Right)\nvoid printInorder(struct Node* node) {\n    if (node == NULL) return;\n    printInorder(node->left);\n    cout << node->data << " ";\n    printInorder(node->right);\n}`, output: "Inorder Traversal: 4 2 5 1 3" },
          "9": { title: "BFS - Graph Traversal", code: `// Breadth First Search using Queue\nvoid BFS(int s) {\n    bool *visited = new bool[V];\n    list<int> queue;\n    visited[s] = true; queue.push_back(s);\n}`, output: "BFS Traversal: 0 1 2 3" },
          "10": { title: "DFS Algorithm", code: `// Depth First Search using Recursion\nvoid DFS(int v) {\n    visited[v] = true;\n    cout << v << " ";\n    for (auto i = adj[v].begin(); i != adj[v].end(); ++i)\n        if (!visited[*i]) DFS(*i);\n}`, output: "DFS Traversal: 2 0 1 3" }
        },
        "notes": {
          "101": { 
            title: "C++ Complete Master Notes", 
            code: `CHAPTER 1: INTRODUCTION TO C++\nC++ is a cross-platform language that can be used to create high-performance applications.\nIt was developed by Bjarne Stroustrup at Bell Labs in 1979 as an extension to the C language.\nC++ adds object-oriented programming features to C. It is one of the world's most popular programming languages.\n\nCHAPTER 2: C++ VARIABLES & DATA TYPES\nVariables are containers for storing data values. In C++, there are different types of variables:\n- int: stores integers (whole numbers), without decimals, e.g., 123 or -123\n- double: stores floating point numbers, with decimals, e.g., 19.99 or -19.99\n- char: stores single characters, such as 'a' or 'B'. Char values are surrounded by single quotes\n- string: stores text, such as "Hello World". String values are surrounded by double quotes\n- bool: stores values with two states: true or false\n\nCHAPTER 3: C++ OPERATORS\nOperators are used to perform operations on variables and values.\n1. Arithmetic Operators: +, -, *, /, %, ++, --\n2. Assignment Operators: =, +=, -=, *=, /=\n3. Comparison Operators: ==, !=, >, <, >=, <=\n4. Logical Operators: && (AND), || (OR), ! (NOT)\n\nCHAPTER 4: C++ CONTROL STRUCTURES\nConditional statements are used to perform different actions based on different conditions.\n- if statement: specifies a block of code to be executed if a condition is true\n- else statement: specifies a block of code to be executed if the same condition is false\n- else if statement: specifies a new condition to test, if the first condition is false\n- switch statement: selects one of many code blocks to be executed\n\nCHAPTER 5: LOOPS IN C++\nLoops can execute a block of code as long as a specified condition is reached.\n- while loop: loops through a block of code as long as a specified condition is true\n- do/while loop: loops through a block of code once, and then repeats the loop as long as the condition is true\n- for loop: loops through a block of code a specified number of times\n\nCHAPTER 6: C++ FUNCTIONS\nA function is a block of code which only runs when it is called.\nYou can pass data, known as parameters, into a function.\nFunctions are used to perform certain actions, and they are important for reusing code: Define the code once, and use it many times.\n\nCHAPTER 7: OBJECT-ORIENTED PROGRAMMING (OOP)\nC++ is an object-oriented programming language.\nOOP stands for Object-Oriented Programming.\nProcedural programming is about writing procedures or functions that perform operations on the data, while object-oriented programming is about creating objects that contain both data and functions.\nThe main pillars of OOP are:\n1. Encapsulation\n2. Abstraction\n3. Inheritance\n4. Polymorphism\n\nCHAPTER 8: CLASSES AND OBJECTS\nA Class is a user-defined data type that has data members and member functions.\nAn Object is an instance of a Class.\nWhen a class is defined, no memory is allocated but when it is instantiated (i.e. an object is created) memory is allocated.\n\nCHAPTER 9: CONSTRUCTORS & DESTRUCTORS\nA constructor is a special member function of a class that is executed whenever we create new objects of that class.\nA destructor is a special member function of a class that is executed whenever an object of its class goes out of scope or the delete expression is applied to a pointer to the object of that class.\n\nCHAPTER 10: INHERITANCE\nInheritance is one of the key features of Object-oriented programming in C++. It allows us to create a new class (derived class) from an existing class (base class).\nTypes of Inheritance:\n- Single Inheritance\n- Multiple Inheritance\n- Multilevel Inheritance\n- Hierarchical Inheritance\n- Hybrid Inheritance\n\nCHAPTER 11: POLYMORPHISM\nThe word polymorphism means having many forms. In simple words, we can define polymorphism as the ability of a message to be displayed in more than one form.\nTwo types of polymorphism:\n1. Compile-time Polymorphism (Function Overloading, Operator Overloading)\n2. Runtime Polymorphism (Virtual Functions)\n\nCHAPTER 12: FILE HANDLING\nFile handling is used to store data permanently in a computer. Using file handling we can store our data in secondary memory (Hard disk).\nClasses for File Stream operations:\n- ofstream: Stream class to write on files\n- ifstream: Stream class to read from files\n- fstream: Stream class to both read and write from/to files.\n\nCHAPTER 13: EXCEPTION HANDLING\nException handling is a process to handle runtime errors. We perform exception handling so the normal flow of the application can be maintained even after runtime errors.\nKeywords: try, catch, and throw.`, 
            output: "C++ Notes Loaded" 
          }
        }
      };

      let selected = programDatabase[lang.toLowerCase()]?.[id];

      // --- CHECK LOCAL STORAGE (Agar user ne save kiya hai to wo load karo) ---
      try {
        const savedNote = localStorage.getItem(`note-${lang}-${id}`);
        
        if (savedNote && selected) {
          // Agar browser memory mein naya note hai, toh use use karo
          selected = { ...selected, code: savedNote };
        }
      } catch (error) {
        console.warn("localStorage access blocked:", error);
      }

      if (selected) {
        setProgram(selected);
        setEditableCode(selected.code); // Editor mein text set karein
      } else {
        setProgram({ 
          title: "Content Not Found", 
          code: "// This content is currently unavailable.", 
          output: "Error 404" 
        });
      }
    };

    fetchFromDatabase();
  }, [lang, id]);

  // --- SAVE FUNCTION (New) ---
  const handleSave = () => {
    try {
      localStorage.setItem(`note-${lang}-${id}`, editableCode); // Save to browser memory
      setProgram({ ...program, code: editableCode }); // Update UI immediately
      setIsEditing(false); // Exit edit mode
      alert("Note Saved Successfully!");
    } catch (error) {
      console.warn("localStorage access blocked during save:", error);
      alert("Note saved in session only (localStorage blocked by browser)");
      // Still update UI even if localStorage fails
      setProgram({ ...program, code: editableCode });
      setIsEditing(false);
    }
  };

  const handleCopy = () => {
    // Agar notes hain toh text copy karo, nahi toh code
    const textToCopy = program.code.replace(/\/\*|\*\//g, ''); // Remove comments if present
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!program) return <div className="loading">Loading...</div>;

  // ============================================================
  //  SPECIAL DESIGN FOR NOTES (Document Style with EDIT Feature)
  // ============================================================
  if (lang.toLowerCase() === 'notes') {
    return (
      <div className="notes-reader-page">
        {/* Top Navigation Bar */}
        <div className="reader-navbar">
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
             <button className="reader-back-btn" onClick={() => navigate(-1)}>
               <FaArrowLeft /> <span>Back</span>
             </button>
             <h2 className="reader-title">{program.title}</h2>
          </div>
          
          <div className="reader-actions" style={{display:'flex', gap:'10px'}}>
             {/* --- EDIT & SAVE BUTTONS --- */}
             {isEditing ? (
               <button className="reader-save-btn" onClick={handleSave}>
                 <FaSave /> Save
               </button>
             ) : (
               <button className="reader-edit-btn" onClick={() => setIsEditing(true)}>
                 <FaEdit /> Edit
               </button>
             )}

             <button className="reader-copy-btn" onClick={handleCopy}>
               {copied ? <FaCheck color="#28a745"/> : <FaRegCopy />} <span>Copy</span>
             </button>
          </div>
        </div>

        {/* Main Document Content */}
        <div className="reader-container">
          <div className="paper-card">
            
            {/* --- CONDITIONAL RENDERING (EDIT vs VIEW) --- */}
            {isEditing ? (
              <textarea 
                className="notes-editor-textarea"
                value={editableCode}
                onChange={(e) => setEditableCode(e.target.value)}
                placeholder="Type your notes here... Use 'CHAPTER :' for headings."
              />
            ) : (
              <div className="notes-content">
                {program.code.split('\n').map((line, index) => {
                  // --- HEADING DETECTION & FORMATTING ---
                  if (line.includes('CHAPTER')) {
                    return (
                      <div key={index} className="chapter-heading">
                        {line}
                      </div>
                    );
                  }
                  
                  // --- BOLD WORDS (Words before :) ---
                  if (line.includes(':') && !line.includes('CHAPTER')) {
                    const parts = line.split(':');
                    return (
                      <div key={index} className="topic-section">
                        <strong>{parts[0]}:</strong>
                        <span>{parts[1]}</span>
                      </div>
                    );
                  }
                  
                  // --- BULLET POINTS (Lines starting with -) ---
                  if (line.trim().startsWith('-')) {
                    return (
                      <div key={index} className="bullet-point">
                        {line}
                      </div>
                    );
                  }
                  
                  // --- NORMAL PARAGRAPH ---
                  return (
                    <div key={index} className="paragraph">
                      {line}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  //  NORMAL PROGRAM VIEW (Code + Output)
  // ============================================================
  return (
    <div className="view-program-page">
      {/* Top Navigation Bar */}
      <div className="view-navbar">
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
           <button className="back-btn" onClick={() => navigate(-1)}>
             <FaArrowLeft /> <span>Back</span>
           </button>
           <h2 className="program-title">{program.title}</h2>
        </div>
        
        <div className="action-buttons" style={{display:'flex', gap:'10px'}}>
           <button className="copy-btn" onClick={handleCopy}>
             {copied ? <FaCheck color="#28a745"/> : <FaRegCopy />} <span>Copy</span>
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="program-container">
        <div className="code-section">
          <div className="code-header">
            <span>Code:</span>
          </div>
          <div className="code-block">
            <pre>
              <code>{program.code}</code>
            </pre>
          </div>
        </div>

        <div className="output-section">
          <div className="output-header">
            <button 
              className="toggle-output-btn"
              onClick={() => setShowOutput(!showOutput)}
            >
              {showOutput ? 'Hide' : 'Show'} Output
            </button>
          </div>
          
          {showOutput && (
            <div className="output-block">
              <pre>{program.output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProgram;
