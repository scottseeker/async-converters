import ConverterShell from '../../components/ConverterShell/ConverterShell';
import UnitConverter from '../../components/UnitConverter/UnitConverter';
import { volumeConfig } from '../../converters/units/unitConfigs';

export default function VolumeConverter() {
  return (
    <ConverterShell title={volumeConfig.title} description={volumeConfig.description} category="units">
      <UnitConverter config={volumeConfig} />
    </ConverterShell>
  );
}
