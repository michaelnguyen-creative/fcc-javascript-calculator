const keyArr = [
    {
        sym: 0,
        id: "zero"
    },
    {
        sym: 1,
        id: "one"
    },
    {
        sym: 2,
        id: "two"
    },
    {
        sym: 3,
        id: "three"
    },
    {
        sym: 4,
        id: "four"
    },
    {
        sym: 5,
        id: "five"
    },
    {
        sym: 6,
        id: "six"
    },
    {
        sym: 7,
        id: "seven"
    },
    {
        sym: 8,
        id: "eight"
    },
    {
        sym: 9,
        id: "nine"
    },
    {
        sym: "+",
        id: "add"
    },
    {
        sym: "-",
        id: "subtract"
    },
    {
        sym: "*",
        id: "multiply"
    },
    {
        sym: "/",
        id: "divide"
    },
    {
        sym: "=",
        id: "equals"
    },
    {
        sym: ".",
        id: "decimal"
    },
    {
        sym: "AC",
        id: "clear"
    },
    {
        sym: "ANS",
        id: "answer"
    }
]

function Key(props) {
    const val = props.val;
    const inp = props.input;
    const exp = props.expression;
    const ans = props.answer;
    // Only allow valid input to be passed into setInput
    const clickHandler = () => {
        
        // Evaluate number type
        if (typeof val == "number") {
            // if (exp.endsWith("=")) {
            //     const newInput = "".concat(val);
            //     const newDisplay = "".concat(val)
            //     props.parentCallback({
            //         type: "NUM",
            //         inputVal: newInput,
            //         displayVal: newDisplay
            //     })
            // }
            // if input is an empty string
            if (/^[1-9]\d*|^$|\.|^[\-\+\*\/]|^0\./.test(inp)) {
                const newInput = inp.concat(val);
                const newDisplay = exp.concat(val)
                props.parentCallback({
                    type: "NUM",
                    inputVal: newInput,
                    displayVal: newDisplay
                })
            }
            // if input is a zero
            if (/^00/.test(inp)|| /=/.test(inp)) {
                const newInput = "".concat(val);
                const newDisplay = "".concat(val);
                props.parentCallback({
                    type: "NUM",
                    inputVal: newInput,
                    displayVal: newDisplay
                })
            }
            // if input is an operator
            if (/[\+\*\-\/]/.test(inp)) {
                const newInput = "".concat(val);
                const newDisplay = exp.concat(val)
                props.parentCallback({
                    type: "NUM",
                    inputVal: newInput,
                    displayVal: newDisplay
                })
            }
            
        }
        // Evaluate decimal input
        if (val == ".") {
            if (inp.match(/\./g) == null) {
                const newInput = inp.concat(val);
                const newDisplay = exp.concat(val);
                props.parentCallback({
                    type: "DEC",
                    inputVal: newInput,
                    displayVal: newDisplay
                })
            }
            if (/[\+\*\/]/.test(inp)) {
                const newInput = "".concat(val);
                const newDisplay = exp.concat(val);
                props.parentCallback({
                    type: "DEC",
                    inputVal: newInput,
                    displayVal: newDisplay
                })
            }
        }
        // Evaluate operators input
        if (/[\+\-\*\/]/.test(val)) {
            
            if (!/^$|\.|[\+\*\/]/.test(inp) || !(inp == ".")) {
                const newInput = "".concat(val);
                const newDisplay = exp.concat(" ", val, " ");
                props.parentCallback({
                    type: "OP",
                    inputVal: newInput,
                    displayVal: newDisplay
                });
            }
            if (/[\*\/]/.test(inp) && /[\*\/]/.test(val)) {
                const newInput = "".concat(val);
                const newDisplay = exp.replace(/[\*\/] $/, `${val} `);
                props.parentCallback({
                    type: "OP",
                    inputVal: newInput,
                    displayVal: newDisplay
                })
            }
            /* If 2 or more operators are entered consecutively, 
            the operation performed should be the last operator entered 
            (excluding the negative (-) sign) */
            if (/( [\*\/\+\-] ){2,}/.test(exp)) {
                const newInput = "".concat(val);
                const newDisplay = exp.replace(/( [\*\/\+\-] ){2,}/, ` ${val} `);
                props.parentCallback({
                    type: "OP",
                    inputVal: newInput,
                    displayVal: newDisplay
                })
            }
        }
        // Evaluate EQUALS input
        if (val == "=") {
            
            const result = eval(exp);
            const newDisplay = "".concat(result);
            const newInput = "".concat(val);
            return props.parentCallback(
                {
                    type: "CALC",
                    displayVal: newDisplay,
                    inputVal: newInput,
                    answerVal: result
                })
        }
        // Evaluate ALL CLEAR input
        if (val === "AC") {
            props.parentCallback({
                type: "CLR"
            });
        }
        // Evaluate ANSWER input
        // Todo: You need to elaborate on this feature
        if (val == "ANS") {
            props.parentCallback(
                {
                    type: "ANS"
                })
        }
    }
    // Conditional rendering for different kinds of buttons
    return (
        props.val == "=" ?
            <div id={props.identifier} class="btn btn-warning" onClick={clickHandler}>{props.val}</div>
            : props.val == "AC" ? <div id={props.identifier} className="btn btn-danger" onClick={clickHandler}>{props.val}</div>
                : typeof props.val == "number" ? <div id={props.identifier} className="btn btn-primary" onClick={clickHandler}>{props.val}</div>
                    : <div id={props.identifier} className="btn btn-secondary" onClick={clickHandler}>{props.val}</div>
    )
};


function App() {
    const [input, setInput] = React.useState("");
    const [expression, setExpression] = React.useState("")
    const [answer, setAnswer] = React.useState("");

    const handleCallback = (childData) => {
        // Check input received from callback before setting states
        if (childData.type == "CALC") {
            setInput(childData.inputVal)
            setExpression(childData.displayVal)
            setAnswer(childData.answerVal)
            //Problematic...! setInput(childData.data);
        } else if (childData.type == "CLR") {
            setInput("")
            setExpression("")
            setAnswer("")
        } else if (childData.type == "NUM") {
            setInput(childData.inputVal)
            setExpression(childData.displayVal)
        } else if (childData.type == "DEC") {
            setInput(childData.inputVal)
            setExpression(childData.displayVal)
            // ok
            // everytime press button, it will send new data containing one decimal back to parent
            // so parent would need to check first, if input has decimal or not, if not then it approves appending a new dec
            // if input has one decimal already, it would deny the new data
            // Just work with input
            // number and decimal are highly interconnected
            // if (childData.inputVal.match(/\./g).length == 1) {

            // } 
            //setExpression(a)
            //const b = childData.displayVal.replaceAll(/\.+/g, ".")
            //setExpression(b)

        } else if (childData.type == "OP") {
            const a = childData.displayVal
                .replaceAll(/\*+/g, "*")
                .replaceAll(/\/+/g, "/")
                .replaceAll(/\++/g, "+")
                .replaceAll(/-+/g, "-");
            
            setExpression(a)
            setInput(childData.inputVal)
        } else if (childData.type = "ANS") {
            setExpression(answer)
            setInput("")
        }
        
        else {
            setInput("error");
        }

    };

    return (
        <div class="container p-5">
            <h1 class="text-center fs-6">JavaScript Calculator</h1>
            <div id="display" class="bg-light">
                <div>{expression == "" ? 0 : expression}</div>
            </div>
            <div class="container bg-light d-flex flex-row flex-wrap justify-content-center pt-3 pb-3">
                {keyArr.map(ele => (
                    <Key
                        identifier={ele.id}
                        val={ele.sym}
                        input={input}
                        expression={expression}
                        answer={answer}
                        parentCallback={handleCallback}
                    />
                ))}
            </div>
        </div>
    )
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);