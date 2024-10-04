const connect = require('connect'); // Connect is used to create a server
const url = require('url'); // URL module is used to parse query parameters from the URL

// Function to handle incoming requests and perform calculations
function calculate(req, res, next) {
    // Parse the incoming URL and extract its components
    const parsedUrl = url.parse(req.url, true); // Parse the URL, true ensures query string is parsed into an object
    const pathname = parsedUrl.pathname; // Extract the pathname (e.g., /lab2)
    const query = parsedUrl.query; // Extract query parameters (method, x, y)

    // Check if the pathname matches /lab2
    if (pathname === '/lab2') { 
        // Get the method, x, and y values from the query string
        const method = query.method; // String: 'add', 'subtract', 'multiply', or 'divide'
        const x = parseFloat(query.x); // Convert x to a float (number)
        const y = parseFloat(query.y); // Convert y to a float (number)

        // Validate if method, x, and y are present and valid numbers
        if (typeof method === 'undefined' || isNaN(x) || isNaN(y)) {
            res.end('Error: Missing or invalid method, x, or y parameters'); // Error if validation fails
            return; // End request processing here
        }

        let result; // Variable to store the result of the calculation
        let symbol; // Variable to store the operator symbol for the response

        // Determine which operation to perform based on the method parameter
        switch (method) {
            case 'add': // If method is 'add'
                result = x + y; // Add x and y
                symbol = '+'; // Set the symbol to "+"
                break;
            case 'subtract': // If method is 'subtract'
                result = x - y; // Subtract y from x
                symbol = '-'; // Set the symbol to "-"
                break;
            case 'multiply': // If method is 'multiply'
                result = x * y; // Multiply x and y
                symbol = '*'; // Set the symbol to "*"
                break;
            case 'divide': // If method is 'divide'
                if (y === 0) { // Check if y is 0 to prevent division by zero
                    res.end('Error: Division by zero is not allowed'); // Send an error message
                    return; // End request processing here
                }
                result = x / y; // Divide x by y
                symbol = '/'; // Set the symbol to "/"
                break;
            default: // If method is none of the valid options
                res.end('Error: Invalid method. Use "add", "subtract", "multiply", or "divide".'); // Error for invalid method
                return; // End request processing here
        }

        // Display the result in the format: x [operator] y = result
        res.end(`${x} ${symbol} ${y} = ${result}`);
    } else {
        next(); // If the path doesn't match, pass the request to the next middleware
    }
}

const app = connect(); // Create a server using the Connect module


app.use(calculate);

// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000'); // Log a message when the server starts
});
