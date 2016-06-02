/**
 * SI derived units (2.2 Table 3)
 */
module.exports = [
    {   
        quantity: 'plane angle', 
        name: 'radian', 
        symbol: 'rad', 
        other: '1', 
        base: 'm/m' },
    {   
        quantity: 'solid angle', 
        name: 'steradian', 
        symbol: 'sr',
        other: '1',
        base: 'm²/m²' },
    { 
        quantity: 'frequency', 
        name: 'hertz', 
        symbol: 'Hz', 
        base: 's⁻¹' },
    {   
        quantity: 'force', 
        name: 'newton', 
        symbol: 'N', 
        base: 'm kg s⁻²' },
    { 
        quantity: 'pressure, stress',
        name: 'pascal', 
        symbol: 'Pa', 
        other: 'N/m²', 
        base: 'm⁻¹ kg s⁻²' },
    { 
        quantity: 'energy, work, amount of heat', 
        name: 'joule', symbol: 'J', 
        other: 'N m', 
        base: 'm² kg s⁻²' },
    { 
        quantity: 'power, radiant flux', 
        name: 'watt', 
        symbol: 'W', 
        other: 'J/s', 
        base: 'm² kg s⁻³' },
    { 
        quantity: 'electric charge, amount of electricity', 
        name: 'coulomb', 
        symbol: 'C', 
        base: 's A' },
    { 
        quantity: 'electric potential difference, electromotive force', 
        name: 'volt', 
        symbol: 'V', 
        other: 'W/A',
        base: 'm² kg s⁻³ A⁻¹' },
    { 
        quantity: 'capacitance', 
        name: 'farad', 
        symbol: 'F', 
        other: 'C/V', 
        base: 'm⁻² kg⁻¹ s⁴ A²' },
    { 
        quantity: 'electric resistance', 
        name: 'ohm', 
        symbol: 'Ω', 
        other: 'V/A', 
        base: 'm² kg s⁻³ A⁻²' },
    { 
        quantity: 'electric conductance', 
        name: 'siemens', 
        symbol: 'S', 
        other: 'A/V', 
        base: 'm⁻² kg⁻¹ s³ A²' },
    { 
        quantity: 'magnetic flux', 
        name: 'weber', 
        symbol: 'Wb', 
        other: 'V s', 
        base: 'm² kg s⁻² A⁻¹' },
    { 
        quantity: 'magnetic flux density', 
        name: 'tesla', 
        symbol: 'T', 
        other: 'Wb/m²', 
        base: 'kg s⁻² A⁻¹' },
    { 
        quantity: 'inductance', 
        name: 'henry', 
        symbol: 'H', 
        other: 'Wb/A', 
        base: 'm² kg s⁻² A⁻²' },
    { 
        quantity: 'Celsius temperature', 
        name: 'degree Celsius', 
        symbol: '°C',
        base: 'K' },
    { 
        quantity: 'luminous flux', 
        name: 'lumen', 
        symbol: 'lm', 
        other: 'cd sr', 
        base: 'cd' },
    { 
        quantity: 'illuminance', 
        name: 'lux', 
        symbol: 'lx', 
        other: 'lm/m²', 
        base: 'm⁻² cd' },
    { 
        quantity: 'activity referred to a radionuclide', 
        name: 'becquerel', 
        symbol: 'Bq', 
        base: 's⁻¹' },
    { 
        quantity: 'absorbed dose, specific energy (imparted), kerma', 
        name: 'gray',
        symbol: 'Gy', 
        other: 'J/kg', 
        base: 'm² s⁻²' },
    { 
        quantity: 'dose equivalent, ambient dose equivalent, directional dose equivalent, personal dose equivalent', 
        name: 'sievert', 
        symbol: 'Sv', 
        other: 'J/kg', 
        base: 'm² s⁻²' },
    { 
        quantity: 'catalytic activity', 
        name: 'katal', 
        symbol: 'kat',
        base: 's⁻¹ mol' },
];
