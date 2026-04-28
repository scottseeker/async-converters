import ConverterShell from '../../components/ConverterShell/ConverterShell';
import UnitConverter from '../../components/UnitConverter/UnitConverter';
import { weightConfig } from '../../converters/units/unitConfigs';

export default function WeightConverter() {
  return (
    <ConverterShell title={weightConfig.title} description={weightConfig.description} category="units">
      <UnitConverter config={weightConfig} />
    </ConverterShell>
  );
}
