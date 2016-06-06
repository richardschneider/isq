/**
 * Other non-SI units that are acceptable (4.1)
 */
module.exports = [
    /*
     * Table 6. Non-SI units accepted for use with the International System of Units
     */
    {
        quantity: 'time',
        name: 'minute',
        symbol: 'min',
        base: '60 s' },
    {
        quantity: 'time',
        name: 'hour',
        symbol: 'h',
        base: '60 min' },
    {
        quantity: 'time',
        name: 'day',
        symbol: 'd',
        base: '24 h' },
    {
        quantity: 'area',
        name: 'hectare',
        symbol: 'ha',
        base: 'hm²' },
    {
        quantity: 'volume',
        name: 'litre',
        symbol: 'L',
        base: '10⁻³ m³' },
    {
        quantity: 'volume',
        symbol: 'l',
        base: 'L' },
    {
        quantity: 'mass',
        name: 'tonne',
        symbol: 't',
        base: '10³ kg' },

    /*
     * Table 8. Other non-SI units
     */
    {
        quantity: 'pressure',
        name: 'bar',
        symbol: 'bar',
        other: ['0.1 MPa', '100 kPa'],
        base: '10^5 Pa' },
    {
        quantity: 'pressure',
        name: 'millimetre of mercury',
        symbol: 'mmHg',
        base: '133.322 Pa' },
    {
        quantity: 'length',
        name: 'ångström',
        symbol: 'Å',
        other: '100 pm',
        base: '10^-10 m' },
    {
        quantity: 'distance',
        name: 'nautical mile',
        symbol: 'M',
        base: '1852 m' },
    {
        quantity: 'area',
        name: 'barn',
        symbol: 'b',
        other: '100 fm^2',
        base: '10^-28 m^2' },
     {
        quantity: 'speed',
        name: 'knot',
        symbol: 'kn',
        base: '(1852/3600) m/s' },

];
