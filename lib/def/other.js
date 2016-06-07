/**
 * Other non-SI units that are acceptable (4.1)
 */
module.exports = [
    /*
     * Table 6. Non-SI units accepted for use with the International System of Units
     */
    {
        system: 'non-SI',
        quantity: 'time',
        name: 'minute',
        symbol: 'min',
        base: '60 s' },
    {
        system: 'non-SI',
        quantity: 'time',
        name: 'hour',
        symbol: 'h',
        base: '60 min' },
    {
        system: 'non-SI',
        quantity: 'time',
        name: 'day',
        symbol: 'd',
        base: '24 h' },
    {
        system: 'non-SI',
        quantity: 'area',
        name: 'hectare',
        symbol: 'ha',
        base: 'hm²' },
    {
        system: 'non-SI',
        quantity: 'volume',
        name: 'litre',
        symbol: 'L',
        base: '10⁻³ m³' },
    {
        system: 'non-SI',
        quantity: 'volume',
        symbol: 'l',
        base: 'L' },
    {
        system: 'non-SI',
        quantity: 'mass',
        name: 'tonne',
        symbol: 't',
        base: '10³ kg' },

    /*
     * Table 8. Other non-SI units
     */
    {
        system: 'non-SI',
        quantity: 'pressure',
        name: 'bar',
        symbol: 'bar',
        other: ['0.1 MPa', '100 kPa'],
        base: '10^5 Pa' },
    {
        system: 'non-SI',
        quantity: 'pressure',
        name: 'millimetre of mercury',
        symbol: 'mmHg',
        base: '133.322 Pa' },
    {
        system: 'non-SI',
        quantity: 'length',
        name: 'ångström',
        symbol: 'Å',
        other: '100 pm',
        base: '10^-10 m' },
    {
        system: 'non-SI',
        quantity: 'distance',
        name: 'nautical mile',
        symbol: 'M',
        base: '1852 m' },
    {
        system: 'non-SI',
        quantity: 'area',
        name: 'barn',
        symbol: 'b',
        other: '100 fm^2',
        base: '10^-28 m^2' },
     {
        system: 'non-SI',
        quantity: 'speed',
        name: 'knot',
        symbol: 'kn',
        base: '(1852/3600) m/s' },

];
