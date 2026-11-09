import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import theme from '@/src/shared/theme/theme';

type CurrencyInputProps = Omit<TextInputProps, 'value' | 'onChangeText' | 'keyboardType'> & {
  value: string | undefined;
  onChangeValue: (value: string) => void;
};

/** Recebe somente dígitos; por exemplo, 25000 vira R$ 250,00 e o valor interno 250.00. */
export default function CurrencyInput({ value, onChangeValue, style, ...props }: CurrencyInputProps) {
  const displayValue = value ? formatCurrencyInput(value) : '';

  const handleChange = (input: string) => {
    const digits = input.replace(/\D/g, '').slice(0, 15);
    if (!digits) {
      onChangeValue('');
      return;
    }

    const padded = digits.padStart(3, '0');
    const whole = stripLeadingZeros(padded.slice(0, -2));
    const cents = padded.slice(-2);
    onChangeValue(`${whole}.${cents}`);
  };

  return (
    <TextInput
      {...props}
      value={displayValue}
      onChangeText={handleChange}
      keyboardType="number-pad"
      placeholder={props.placeholder ?? 'R$ 0,00'}
      placeholderTextColor={props.placeholderTextColor ?? theme.colors.textMuted}
      style={[styles.input, style]}
    />
  );
}

function formatCurrencyInput(value: string) {
  const match = /^(\d+)(?:\.(\d{0,2}))?$/.exec(value);
  if (!match) return '';

  const whole = stripLeadingZeros(match[1]);
  const groupedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const cents = (match[2] ?? '').padEnd(2, '0');
  return `R$ ${groupedWhole},${cents}`;
}

function stripLeadingZeros(value: string) {
  return value.replace(/^0+(?=\d)/, '') || '0';
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 15,
  },
});
