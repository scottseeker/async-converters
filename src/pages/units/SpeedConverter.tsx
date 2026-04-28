import ConverterShell from '../../components/ConverterShell/ConverterShell';
import UnitConverter from '../../components/UnitConverter/UnitConverter';
import { speedConfig } from '../../converters/units/unitConfigs';

export default function SpeedConverter() {
  return (
    <ConverterShell title={speedConfig.title} description={speedConfig.description} category="units">
      <UnitConverter config={speedConfig} />
    </ConverterShell>
  );
}
