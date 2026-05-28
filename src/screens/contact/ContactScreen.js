import ContactForm from './ContactForm';

/**
 * Navigation entry — no hooks here (avoids Fast Refresh / tab mount hook mismatch).
 */
export default function ContactScreen(screenProps) {
    const params = screenProps?.route?.params ?? {};
    return (
        <ContactForm
            productName={params.productName}
            fromCart={Boolean(params.fromCart)}
        />
    );
}
