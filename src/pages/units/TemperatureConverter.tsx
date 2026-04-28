import ConverterShell from '../../components/ConverterShell/ConverterShell';
import UnitConverter from '../../components/UnitConverter/UnitConverter';
import { temperatureConfig } from '../../converters/units/unitConfigs';

export default function TemperatureConverter() {
  return (
    <ConverterShell title={temperatureConfig.title} description={temperatureConfig.description} category="units">
      <UnitConverter config={temperatureConfig} />
    </ConverterShell>
  );
}
