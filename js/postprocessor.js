// This object represent the postprocessor
Postprocessor = {
    // The postprocess function takes the audio samples data and the post-processing effect name
    // and the post-processing stage as function parameters. It gathers the required post-processing
    // paramters from the <input> elements, and then applies the post-processing effect to the
    // audio samples data of every channels.
    postprocess: function(channels, effect, pass) {
        switch(effect) {
            case "no-pp":
                // Do nothing
                break;

            case "reverse":
                /**
                * TODO: Complete this function
                 **/

                // Post-process every channels
				
                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
					//var temp =channels[c].audioSequenceReference;
					var audioSequence = channels[c].audioSequenceReference;
					
					var temp;
					for (var i = 0; i < audioSequence.data.length/2; i++) {
						temp = audioSequence.data[i];
						audioSequence.data[i]= audioSequence.data[audioSequence.data.length-1-i];
						audioSequence.data[audioSequence.data.length-1-i] = temp;
					}
					//audioSequence.reverse();
					
                    // Apply the post-processing, i.e. reverse
					//channels[c].audioSequenceReference = channels[channels.length-1-c].audioSequenceReference;
                    // Update the sample data with the post-processed data
					//channels[channels.length-1-c].audioSequenceReference=temp;
					
					channels[c].setAudioSequence(audioSequence);
                }
                break;

            case "boost":
                // Find the maximum gain of all channels
                var maxGain = -1.0;
                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
                    var audioSequence = channels[c].audioSequenceReference;
                    var gain = audioSequence.getGain();
                    if(gain > maxGain) {
                        maxGain = gain;
                    }
                }

                // Determin the boost multiplier
                var multiplier = 1.0 / maxGain;

                // Post-process every channels
                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
                    var audioSequence = channels[c].audioSequenceReference;

                    // For every sample, apply a boost multiplier
                    for(var i = 0; i < audioSequence.data.length; ++i) {
                        audioSequence.data[i] *= multiplier;
                    }

                    // Update the sample data with the post-processed data
                    channels[c].setAudioSequence(audioSequence);
                }
                break;

            case "adsr":
                /**
                * TODO: Complete this function
                **/

                // Obtain all the required parameters
                var attackDuration = parseFloat($("#adsr-attack-duration").data("p" + pass)) * sampleRate;
                var decayDuration = parseFloat($("#adsr-decay-duration").data("p" + pass)) * sampleRate;
                var releaseDuration = parseFloat($("#adsr-release-duration").data("p" + pass)) * sampleRate;
                var sustainLevel = parseFloat($("#adsr-sustain-level").data("p" + pass)) / 100.0;
				//*SampleRate meaning that whow many sample number 

                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
                    var audioSequence = channels[c].audioSequenceReference;

                    for(var i = 0; i < audioSequence.data.length; ++i) {

                        // TODO: Complete the ADSR postprocessor
                        // Hinst: You can use the function lerp() in utility.js
                        // for performing linear interpolation
						
						var sustainDuration=audioSequence.data.length-attackDuration-decayDuration-releaseDuration;
						//var sustainDuration= (6-(parseFloat($("#adsr-attack-duration").data("p" + pass)))- 
						//			(parseFloat($("#adsr-decay-duration").data("p" + pass)))-(parseFloat($("#adsr-release-duration").data("p" + pass))))*sampleRate;
						if (i<attackDuration){
							var multiplier = lerp(0, 1, i/attackDuration);
							audioSequence.data[i] = audioSequence.data[i] * multiplier;
						}
						else if (i>=attackDuration&&i<attackDuration+decayDuration){
							var k=i-attackDuration;
							var multiplier = lerp(1, sustainLevel, k/decayDuration);
							audioSequence.data[i] = audioSequence.data[i] * multiplier;
						}
						else if(i>=attackDuration+decayDuration &&i <attackDuration+decayDuration+sustainDuration){
							var multiplier = sustainLevel;
							audioSequence.data[i] = audioSequence.data[i] * multiplier;
						}else{
							var k=i-attackDuration-decayDuration-sustainDuration;
							var multiplier = lerp(sustainLevel,0, k/releaseDuration );
							audioSequence.data[i] = audioSequence.data[i] * multiplier;
						}
						
                        
                    }

                    // Update the sample data with the post-processed data
                    channels[c].setAudioSequence(audioSequence);
                }
                break;
				
            case "tremolo":
                /**
                * TODO: Complete this function
                **/

                // Obtain all the required parameters
                var tremoloFrequency = parseFloat($("#tremolo-frequency").data("p" + pass));
                var wetness = parseFloat($("#tremolo-wetness").data("p" + pass));

                // Post-process every channels
                for(var c = 0; c < channels.length; ++c) {
					// Get the sample data of the channel
					var audioSequence = channels[c].audioSequenceReference;
					
					// For every sample, apply a tremolo multiplier
					
					for (var i = 0; i < audioSequence.data.length; i++) {
						var currentTime = i / sampleRate;
						var multiplier =wetness/2 *Math.sin( (2 * Math.PI * tremoloFrequency * currentTime)-90)+(1-wetness/2);
						//var multiplier = 0.5*(wetness*Math.sin( 2 * Math.PI * tremoloFrequency * currentTime)+1);
						audioSequence.data[i]=audioSequence.data[i]*multiplier;
						
					}

					// For every sample, apply a tremolo multiplier
					channels[c].setAudioSequence(audioSequence);

                    
                }
                break;

            case "echo":
                /**
                * TODO: Complete this function
                **/

                // Obtain all the required parameters
                var delayLineDuration = parseFloat($("#echo-delay-line-duration").data("p" + pass));
                var multiplier = parseFloat($("#echo-multiplier").data("p" + pass));

                // Post-process every channels
                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
					var audioSequence = channels[c].audioSequenceReference;
                    // Create a new empty delay line
					
					var delayLineSize = parseInt(delayLineDuration * sampleRate);// how many sample in a delayline
					var delayLine = [];
					for (var i = 0; i < delayLineSize; i++){
						delayLine.push(0);
					}

                    // Get the sample data of the channel
                    for(var i = 0; i < audioSequence.data.length; ++i) {
                        // Get the echoed sample from the delay line
						var delayLineOutput;
						delayLineOutput = delayLine[i % delayLineSize];
						
                        // Add the echoed sample to the current sample, with a multiplier
						audioSequence.data[i] = audioSequence.data[i] + delayLineOutput * multiplier;

                        // Put the current sample into the delay line
						delayLine[i % delayLineSize] = audioSequence.data[i];
						
						
                    }

                    // Update the sample data with the post-processed data
					channels[c].setAudioSequence(audioSequence);
                }
                break;
            
            default:
                // Do nothing
                break;
        }
        return;
    }
}
