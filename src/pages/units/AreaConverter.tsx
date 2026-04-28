import ConverterShell from '../../components/ConverterShell/ConverterShell';
import UnitConverter from '../../components/UnitConverter/UnitConverter';
import { areaConfig } from '../../converters/units/unitConfigs';

export default function AreaConverter() {
  return (
    <ConverterShell title={areaConfig.title} description={areaConfig.description} category="units">
      <UnitConverter config={areaConfig} />
    </ConverterShell>
  );
}
