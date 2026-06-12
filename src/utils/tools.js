

export const checkIntergerAndSetValue = (variable, defaultValue) => {
    if ((!Number.isInteger(variable) || variable < defaultValue)) {
        variable = 1;
    }

    return variable
}