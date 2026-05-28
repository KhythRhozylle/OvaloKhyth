import ContactArchCard from './ContactArchCard';

/** Blush arch card for sign-in / register screens. */
const AuthArchCard = ({ children, style }) => (
    <ContactArchCard style={[{ marginTop: 0 }, style]}>{children}</ContactArchCard>
);

export default AuthArchCard;
