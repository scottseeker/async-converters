import ConverterShell from '../../components/ConverterShell/ConverterShell';
import UnitConverter from '../../components/UnitConverter/UnitConverter';
import { lengthConfig } from '../../converters/units/unitConfigs';

export default function LengthConverter() {
  return (
    <ConverterShell title={lengthConfig.title} description={lengthConfig.description} category="units">
      <UnitConverter config={lengthConfig} />
    </ConverterShell>
  );
}
