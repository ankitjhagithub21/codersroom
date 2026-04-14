// Starter code templates for famous programming languages
export const starterCodeTemplates = {
  javascript: `console.log("Hello, World!");`,

  python: `print("Hello, World!")`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,

  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    return 0;
}`,

  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    
    return 0;
}`,

  csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,
};

// Function to get starter code for a language
export const getStarterCode = (languageValue) => {
  return starterCodeTemplates[languageValue] || starterCodeTemplates.javascript;
};
