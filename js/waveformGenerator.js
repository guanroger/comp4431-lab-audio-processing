// This object represent the waveform generator
var WaveformGenerator = {
    // The generateWaveform function takes 4 parameters:
    //     - type, the type of waveform to be generated
    //     - frequency, the frequency of the waveform to be generated
    //     - amp, the maximum amplitude of the waveform to be generated
    //     - duration, the length (in seconds) of the waveform to be generated
    generateWaveform: function(type, frequency, amp, duration) {
        var nyquistFrequency = sampleRate / 2; // Nyquist frequency
        var totalSamples = Math.floor(sampleRate * duration); // Number of samples to generate
        var result = []; // The temporary array for storing the generated samples

        switch(type) {
            case "sine-time": // Sine wave, time domain
                for (var i = 0; i < totalSamples; ++i) {
                    var currentTime = i / sampleRate;
                    result.push(amp * Math.sin(2.0 * Math.PI * frequency * currentTime));
                }
                break;

            case "square-time": // Square wave, time domain
                /**
                * TODO: Complete this generator
                **/
				var oneCycle= sampleRate/frequency;
				var halfCycle= oneCycle/2;
				for (var i=0; i<totalSamples; i++){
					var whereInTheCycle =i% parseInt(oneCycle);
					if (whereInTheCycle<halfCycle){
						result.push(amp*1);
					}else{
						result.push(amp*(-1));
					}
				}
                break;

            case "square-additive": // Square wave, additive synthesis
                /**
                * TODO: Complete this generator
                **/
				for (var i=0; i<totalSamples; i++){
					var t=i/sampleRate;
					var sample =0;
					var k=1;
					while ((k*frequency)<(sampleRate/2.0)){
						sample+=(1.0/k)*Math.sin(2*Math.PI*k*frequency*t);
						k+=2;
					}
					result.push(amp*sample);
				}
                break;

            case "sawtooth-time": // Sawtooth wave, time domain
                /**
                * TODO: Complete this generator
                **/
				var oneCycle= sampleRate/frequency;
				for (var i=0; i<totalSamples; i++){
					var whereInTheCycle =i% parseInt(oneCycle);
					var fractionInTheCycle=whereInTheCycle/oneCycle;
					result.push(amp*(1.0-fractionInTheCycle)-(amp/2));
				}
                break;

            case "sawtooth-additive": // Sawtooth wave, additive synthesis
                /**
                * TODO: Complete this generator
                **/
				for (var i=0; i<totalSamples; i++){
					var t=i/sampleRate;
					var sample =0;
					var k=1;
					while ((k*frequency)<(sampleRate/2.0)){
						sample+=(1.0/k)*Math.sin(2*Math.PI*k*frequency*t);
						k+=1;
					}
					result.push(amp*sample);
				}
                break;

            case "triangle-additive": // Triangle wave, additive synthesis
                /**
                * TODO: Complete this generator
                **/
				for (var i=0; i<totalSamples; i++){
					var t=i/sampleRate;
					var sample =0;
					var k=1;
					while ((k*frequency)<(sampleRate/2.0)){
						sample+=(1.0/(k*k))*Math.cos(2*Math.PI*k*frequency*t);
						k+=2;
					}
					result.push(amp*sample);
				}
                break;

            case "karplus-strong": // Karplus-Strong algorithm
                /**
                * TODO: Complete this generator
                **/

                // Obtain all the required parameters
                var base = $("#karplus-base>option:selected").val();
                var b = parseFloat($("#karplus-b").val());
                var delay = parseInt($("#karplus-p").val());
				var useKF = $("#karplus-use-freq").prop("checked");
				
				if (useKF){
					delay=parseInt(sampleRate/frequency);// the number of the sample in delay
				}
				
				if (base=="white-noise"){
					
					var sample=[delay];
					for (var i = 0; i < totalSamples; i++) {
						if (i < delay){
							sample [i%delay]=amp*Math.random()-(amp/2);
							result.push(sample[i%delay]);
						}else{
							var bend =Math.random();
							
							if (bend>=b){
								sample [i%delay]= -0.5*(sample[(i-delay)%delay]+sample[(i-delay+1)%delay]);
								result.push(sample[i%delay]);
							}else{
								sample [i%delay]= 0.5*(sample[(i-delay)%delay]+sample[(i-delay+1)%delay]);
								result.push(sample[i%delay]);
							}
							
						}
					}
					/*for (var i=0; i<delay; i++){
						result.push(amp*Math.random()-(amp/2));
					}*/
					/*var delay = 800; // this is p
					for (var i = 0; i < totalSamples; i++) {
						if (i <= delay){
							samples[i] = 2 * Math.random() – 1;
						}
						else{
							samples[i] = 0.5 *(samples[i–delay] + samples[i–delay-1]);
						}
					}*/
				}else if (base=="sawtooth"){
					var sample=[delay];
					var oneCycle= delay;
					for (var i = 0; i < totalSamples; i++) {
						if (i < delay){
							var whereInTheCycle =i% parseInt(oneCycle);
							var fractionInTheCycle=whereInTheCycle/oneCycle;
							sample [i%delay]=amp*(1.0-fractionInTheCycle)-(amp/2);
							result.push(sample[i%delay]);
						}else{
							var bend =Math.random();
							if (bend>b){
								sample [i%delay]= -0.5*(sample[(i-delay)%delay]+sample[(i-delay+1)%delay]);
								result.push(sample[i%delay]);
							}else{
								sample [i%delay]= 0.5*(sample[(i-delay)%delay]+sample[(i-delay+1)%delay]);
								result.push(sample[i%delay]);
							}
						}
					}
					
					/*var oneCycle= delay;
					for (var i=0; i<delay; i++){
						var whereInTheCycle =i% parseInt(oneCycle);
						var fractionInTheCycle=whereInTheCycle/oneCycle;
						result.push(amp*(1.0-fractionInTheCycle)-(amp/2));
					}*/
					
				}

                break;

            case "white-noise": // White noise
                /**
                * TODO: Complete this generator
                **/
				for (var i=0; i<totalSamples; i++){
					result.push(amp*Math.random()-(amp/2));
				}
                break;

            case "customized-additive-synthesis": // Customized additive synthesis
                /**
                * TODO: Complete this generator
                **/

                // Obtain all the required parameters
				var harmonics = [];
				for (var h = 1; h <= 10; ++h) {
					harmonics.push(parseFloat($("#additive-f" + h).val()));
				}
				
				for (var i=0; i<totalSamples; i++){
					var t=i/sampleRate;
					var sample =0;
					var k=1;
					while (((k*frequency)<(sampleRate/2.0))&&k<=10){
						sample+=harmonics[k-1]*Math.sin(2*Math.PI*k*frequency*t);
						k+=1;
					}
					result.push(amp*sample);
				}
				
                break;

            case "fm": // FM
                /**
                * TODO: Complete this generator
                **/

                // Obtain all the required parameters
                var carrierFrequency = parseFloat($("#fm-carrier-frequency").val());
                var carrierAmplitude = parseFloat($("#fm-carrier-amplitude").val());
                var modulationFrequency = parseFloat($("#fm-modulation-frequency").val());
                var modulationAmplitude = parseFloat($("#fm-modulation-amplitude").val());
                var useADSR = $("#fm-use-adsr").prop("checked");
				var useUF= $("#fm-use-freq-multiplier").prop("checked");
				
				
                if(useADSR) { // Obtain the ADSR parameters
                    var attackDuration = parseFloat($("#fm-adsr-attack-duration").val()) * sampleRate;
                    var decayDuration = parseFloat($("#fm-adsr-decay-duration").val()) * sampleRate;
                    var releaseDuration = parseFloat($("#fm-adsr-release-duration").val()) * sampleRate;
                    var sustainLevel = parseFloat($("#fm-adsr-sustain-level").val()) / 100.0;
                }
				if (useUF){
					carrierFrequency=carrierFrequency*frequency;
					modulationFrequency=modulationFrequency*frequency;
				}
				
				// generate the sine wave 
				for (var i = 0; i < totalSamples; ++i) {
                    					
					var sustainDuration =totalSamples-parseFloat($("#fm-adsr-attack-duration").val())-parseFloat($("#fm-adsr-decay-duration").val())-parseFloat($("#fm-adsr-release-duration").val());
					//var sustainDuration = (6-(parseFloat($("#fm-adsr-attack-duration").val()))- 
					//				(parseFloat($("#fm-adsr-decay-duration").val()))-(parseFloat($("#fm-adsr-release-duration").val())))*sampleRate;
					
					if (i<attackDuration){
						var multiplier = lerp(0, 1, i/attackDuration);
					}
					else if (i>=attackDuration&&i<attackDuration+decayDuration){
						var k=i-attackDuration;
						var multiplier = lerp(1, sustainLevel, k/decayDuration);
					}
					else if(i>=attackDuration+decayDuration &&i <attackDuration+decayDuration+sustainDuration){
						var multiplier = sustainLevel;
					}else{
						var k=i-attackDuration-decayDuration-sustainDuration;
						var multiplier = lerp(sustainLevel,0, k/releaseDuration );
					}
					
					var currentTime = i / sampleRate;
					
										
					if (useADSR){
					
						
						var modulator = multiplier*modulationAmplitude*Math.sin(2.0 * Math.PI* modulationFrequency * currentTime);
						result.push(amp*carrierAmplitude * Math.sin(2.0 * Math.PI * carrierFrequency * currentTime + modulator));
					}
					else {
						
						var modulator = modulationAmplitude*Math.sin(2.0 * Math.PI* modulationFrequency * currentTime);
						result.push(amp*carrierAmplitude * Math.sin(2.0 * Math.PI * carrierFrequency * currentTime + modulator));
					}
                }

                break;

            case "repeating-narrow-pulse": // Repeating narrow pulse
                var cycle = Math.floor(sampleRate / frequency);
                for (var i = 0; i < totalSamples; ++i) {
                    if(i % cycle === 0) {
                        result.push(amp * 1.0);
                    } else if(i % cycle === 1) {
                        result.push(amp * -1.0);
                    } else {
                        result.push(0.0);
                    }
                }
                break;

            default:
                break;
        }

        return result;
    }
};
